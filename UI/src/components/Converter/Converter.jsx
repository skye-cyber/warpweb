import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { TOOLS as alltools, getToolsByCategory, InterfaceComponentMap } from "../../config/ToolSchema";
import { setActiveTab, setActiveTool } from "../../store/warpSlice";
import { toTitleCase } from "../../utils/extendJS";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MargicTool } from "../svg/core";
import { DocumentTool } from "../Tools/DocumentTools/DocumentTool";

export const Converter = ({ }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { activeTool, ui } = useSelector((state) => state.warp);
    const [Tools, setTools] = React.useState(null)
    const availableToolRef = React.useRef()
    const InterfaceComponent = React.useRef(null)

    React.useEffect(() => {
        if (ui.activeTab === 'dashboard') return navigate('/dashboard');

        const component = InterfaceComponentMap[ui.activeTab]
        if (component) InterfaceComponent.current = component

        const tools = getToolsByCategory(ui.activeTab);
        setTools(tools);
    }, [ui.activeTab, navigate, getToolsByCategory]);

    const ToolSwitch = React.useCallback((tool) => {
        console.log("Switch tool:", tool)
        dispatch(setActiveTab(tool.category))
        dispatch(setActiveTool(tool))

        // TODO Update active tool item in the nav
        // Active tool className: 'bg-blue-50 dark:bg-blue-900 border-blue-500 border-r-4'
        // Inactive Tool className: ''
    })

    const DropZoneInit = () => {
        //setupFileDropZone('doc-drop-zone', 'doc-file-input');
        // setupFileDropZone('doc-drop-zone', 'audio-file-input');
        // ...
    }

    const openTools = () => {
        availableToolRef.current.classList.remove('hidden')
    }

    const closeTools = () => {
        availableToolRef.current.classList.add('hidden')
    }

    const toggleTools = () => {
        if (availableToolRef.current.classList.contains('hidden')) {
            openTools()
        } else {
            closeTools()
        }
    }

    const ToolButton = ({ tool, aosdelay = 0 }) => {
        if (!tool) return
        return (
            <button
                onClick={() => ToolSwitch(tool)}
                /*data-aos="fade-in" aos-delay={aosdelay}*/
                className={`tool-nav w-full text-left p-1 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-blend-900 transition-colors tool-${tool.id} hover:border-x-2 border-blue-400 dark:border-secondary-100 trasition-transform transition-all duration-500`}
            >
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100"
                    >{toTitleCase(tool.name)}</span
                    >
                    <ChevronRight className="hidden sm:block w-5 h-5 fill-gray-400" />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0 sm:mt-1">
                    {tool.description}
                </p>
            </button>
        )
    }

    return (
        <div className="w-full max-w-screen h-screen py-0 overflow-hidden">
            {/* Tools Grid */}
            <div className="relative block sm:flex gap-0 h-full">
                {/* Tools Navigation */}
                <div
                    ref={availableToolRef}
                    className="block sticky top-0 left-0 z-[5] bg-white dark:bg-cyber-950 rounded-none shadow-md p-2 sm:px-4 sm:pb-20 w-fit max-w-full sm:max-w-[30%] sm:h-full overflow-auto scrollbar-custom"
                >
                    <div className="sticky -top-6 left-0 z-[5] text-lg bg-inherit w-full">
                        <h3 className=" font-semibold mb-4 text-gray-900 dark:text-white">
                            Available Tools
                        </h3>
                    </div>
                    <div className="flex flex-wrap sm:block space-y-0 sm:space-y-2 mt-2">
                        {Tools &&
                            Object.keys(alltools).map((toolkey, key) => {
                                const delay = 100 * key
                                return <ToolButton key={key} tool={Tools[toolkey]} aosdelay={delay} />
                            })}
                    </div>
                </div>

                {/* Tool Interface */}
                <div className="h-fit sm:h-full sm:min-h-[70%] w-full mt-1 mx-0.5">
                    <div
                        id="tool-interface"
                        className="flex items-center justify-center h-[90%] w-full bg-white dark:bg-cyber-950 rounded-none sm:rounded-xl shadow-md p-2 sm:p-6 overflow-y-auto"
                    >
                        {activeTool && InterfaceComponent.current && activeTool.category !== 'dashboard' ?
                            <InterfaceComponent.current tool={activeTool} />
                            :
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <span className="flex justify-center mb-4">
                                    <MargicTool className="w-12 h-12 fill-sky-500 dark:fill-gray-300" />
                                </span>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 font-normal">Select a Tool</h3>
                                <p className="text-sm sm:text-[16px]">
                                    Choose a tool from the left sidebar to start processing your files
                                </p>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div >
    )
}
