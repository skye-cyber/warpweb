from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from warpapp.services.format_service import FormatService
from warpapp.api.dependencies import get_format_service
from warpapp.utils.logger import logger


router = APIRouter(prefix="/api/v1/formats", tags=["formats"])


@router.get("")
async def list_all_formats(
    category: Optional[str] = Query(None, description="Filter by category"),
    format_service: FormatService = Depends(get_format_service),
):
    """
    List all supported file formats
    """
    return format_service.list_formats(category)


@router.get("/categories")
async def get_format_categories(
    format_service: FormatService = Depends(get_format_service),
):
    """
    Get all format categories
    """
    return format_service.get_categories()


@router.get("/{format_key}")
async def get_format_info(
    format_key: str, format_service: FormatService = Depends(get_format_service)
):
    """
    Get information about a specific format
    """
    info = format_service.get_format_info(format_key)
    if not info:
        # Try as extension
        info = format_service.get_format_by_extension(format_key)

    if not info:
        raise HTTPException(status_code=404, detail=f"Format not found: {format_key}")

    return info


@router.get("/{format_key}/compatible")
async def get_compatible_formats(
    format_key: str,
    direction: str = Query("output", enum=["input", "output"]),
    format_service: FormatService = Depends(get_format_service),
):
    """
    Get compatible formats for a given format
    """
    formats = format_service.get_compatible_formats(format_key, direction)

    if not formats:
        # Check if format exists
        info = format_service.get_format_info(format_key)
        if not info:
            info = format_service.get_format_by_extension(format_key)

        if not info:
            raise HTTPException(
                status_code=404, detail=f"Format not found: {format_key}"
            )

    return {"format": format_key, "direction": direction, "compatible_formats": formats}


@router.post("/validate-conversion")
async def validate_conversion(
    input_format: str,
    output_format: str,
    format_service: FormatService = Depends(get_format_service),
):
    """
    Validate if conversion between formats is supported
    """
    valid, message = format_service.validate_conversion(input_format, output_format)

    return {
        "valid": valid,
        "message": message,
        "input_format": input_format,
        "output_format": output_format,
    }


@router.get("/extensions/all")
async def get_all_extensions(
    category: Optional[str] = Query(None, description="Filter by category"),
    format_service: FormatService = Depends(get_format_service),
):
    """
    Get all file extensions
    """
    extensions = format_service.get_all_extensions(category)

    return {
        "category": category or "all",
        "count": len(extensions),
        "extensions": extensions,
    }


@router.get("/by-category/{category}")
async def get_formats_by_category(
    category: str, format_service: FormatService = Depends(get_format_service)
):
    """
    Get all formats in a specific category
    """
    formats = format_service.list_formats(category)

    if not formats:
        raise HTTPException(status_code=404, detail=f"Category not found: {category}")

    return {"category": category, "count": len(formats), "formats": formats}


@router.get("/suggest-output/")
async def suggest_output_format(
    input_format: str,
    preferred: Optional[str] = Query(None, description="Preferred output format"),
    format_service: FormatService = Depends(get_format_service),
):
    """
    Suggest an output format based on input
    """
    suggested = format_service.suggest_output_format(input_format, preferred)

    if not suggested:
        # Check if input format exists
        info = format_service.get_format_info(input_format)
        if not info:
            info = format_service.get_format_by_extension(input_format)

        if not info:
            raise HTTPException(
                status_code=404, detail=f"Format not found: {input_format}"
            )

        return {
            "input_format": input_format,
            "suggested": None,
            "message": "No compatible output formats found",
        }

    return {
        "input_format": input_format,
        "preferred": preferred,
        "suggested": suggested,
    }


@router.get("/matrix/{category}")
async def get_conversion_matrix(
    category: str, format_service: FormatService = Depends(get_format_service)
):
    """
    Get conversion matrix for a category
    """
    formats = format_service.list_formats(category)

    matrix = []
    for in_fmt in formats:
        row = {
            "input": in_fmt["key"],
            "can_convert_to": format_service.get_compatible_formats(
                in_fmt["key"], "output"
            ),
        }
        matrix.append(row)

    return {
        "category": category,
        "formats": [f["key"] for f in formats],
        "matrix": matrix,
    }


@router.get("/mime/{extension}")
async def get_mime_type(
    extension: str, format_service: FormatService = Depends(get_format_service)
):
    """
    Get MIME type for a file extension
    """
    import mimetypes

    if not extension.startswith("."):
        extension = f".{extension}"

    mime_type, _ = mimetypes.guess_type(f"file{extension}")

    info = format_service.get_format_by_extension(extension)

    return {"extension": extension, "mime_type": mime_type, "format_info": info}


@router.get("/compare")
async def compare_formats(
    format1: str,
    format2: str,
    format_service: FormatService = Depends(get_format_service),
):
    """
    Compare two formats
    """
    info1 = format_service.get_format_info(
        format1
    ) or format_service.get_format_by_extension(format1)
    info2 = format_service.get_format_info(
        format2
    ) or format_service.get_format_by_extension(format2)

    if not info1:
        raise HTTPException(status_code=404, detail=f"Format not found: {format1}")
    if not info2:
        raise HTTPException(status_code=404, detail=f"Format not found: {format2}")

    return {
        "format1": info1,
        "format2": info2,
        "can_convert_1_to_2": format2 in info1.get("can_convert_to", []),
        "can_convert_2_to_1": format1 in info2.get("can_convert_to", []),
        "same_category": info1.get("category") == info2.get("category"),
    }
