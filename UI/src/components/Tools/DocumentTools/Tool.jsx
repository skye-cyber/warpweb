import { ConvertDocument } from "./ConvertDocument"
import { PDFJoin } from "./PDFJoin"
import { PDFOCR } from "./PDFOCR"
import { PDF2LongImage } from "./PDF2Long"
import { ExtractPDFpages } from "./PDFpages"
import { Document2Image } from "./DOC2Image"

export const DocumentTool = ({ tool }) => {
    return (
        <section className="mt-8 w-full sm:w-fit sm:min-w-[70%] sm:max-w-full">
            {tool.id === 'convert_doc' &&
                <ConvertDocument />
            }
            {/* PDF Joining Tool */}
            {tool.id === 'pdf_join' &&
                <PDFJoin />
            }

            {/* PDF Text Extraction */}
            {tool.id === 'scan_pdf' &&
                <PDFOCR />
            }

            {/* PDF to long Image */}
            {tool.id === 'doc_long_image' &&
                <PDF2LongImage />
            }

            {/* PDF Page Extraction (splitting) */}
            {tool.id === 'extract_pages' &&
                <ExtractPDFpages />
            }

            {/* Doc to Images */}
            {tool.id === 'doc2image' &&
                <Document2Image />
            }
        </section>
    )
}
