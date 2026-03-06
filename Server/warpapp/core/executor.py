import threading
import traceback
from typing import Dict, Any, Optional, Callable
from datetime import datetime
# import sys
# from pathlib import Path
# sys.path.insert(0, Path(__file__).parent.parent.absolute().as_posix())
from warpapp.core.interpreter import OperationInterpreter
from warpapp.models.tasks import TaskModel, TaskStatus
from warpapp.utils.logger import logger


class OperationExecutor:
    """
    Executes operations with proper error handling and progress tracking
    """

    def __init__(self, filewarp_path: Optional[str] = None):
        self.interpreter = OperationInterpreter(filewarp_path)
        self.active_tasks = {}
        self._lock = threading.Lock()

    def execute(
        self, task: TaskModel, progress_callback: Optional[Callable] = None
    ) -> Dict[str, Any]:
        """
        Execute a task and return the result
        """
        try:
            # Get the appropriate handler
            handler = self.interpreter.interpret(task.operation)

            # Create wrapped progress callback
            def wrapped_progress(progress: int, message: str):
                task.progress = progress
                task.message = message
                task.logs.append(f"[{datetime.now().isoformat()}] {message}")
                if progress_callback:
                    progress_callback(progress, message)

            # Execute the handler
            result = handler(task.params, wrapped_progress)

            # Update task with result
            task.result = result
            task.status = TaskStatus.COMPLETED
            task.progress = 100
            task.message = "Operation completed successfully"

            return result

        except Exception as e:
            # Log the error
            error_msg = f"Operation failed: {str(e)}"
            logger.error(error_msg)
            logger.debug(traceback.format_exc())

            # Update task with error
            task.status = TaskStatus.FAILED
            task.error = error_msg
            task.message = error_msg
            task.logs.append(f"[{datetime.now().isoformat()}] ERROR: {error_msg}")

            # Re-raise for task manager to handle
            raise

    def execute_async(self, task: TaskModel, callback: Optional[Callable] = None):
        """
        Execute a task asynchronously in a separate thread
        """

        def _execute_wrapper():
            try:
                with self._lock:
                    self.active_tasks[task.task_id] = task

                result = self.execute(task)

                if callback:
                    callback(task.task_id, True, result)

            except Exception as e:
                if callback:
                    callback(task.task_id, False, str(e))
            finally:
                with self._lock:
                    if task.task_id in self.active_tasks:
                        del self.active_tasks[task.task_id]

        thread = threading.Thread(target=_execute_wrapper)
        thread.daemon = True
        thread.start()

        return thread

    def cancel_task(self, task_id: str) -> bool:
        """
        Attempt to cancel a running task
        """
        with self._lock:
            if task_id in self.active_tasks:
                task = self.active_tasks[task_id]
                task.cancel_flag = True
                task.status = TaskStatus.CANCELLED
                task.message = "Task cancelled by user"
                return True
        return False

    def get_active_tasks(self) -> Dict[str, TaskModel]:
        """
        Get all currently active tasks
        """
        with self._lock:
            return self.active_tasks.copy()
