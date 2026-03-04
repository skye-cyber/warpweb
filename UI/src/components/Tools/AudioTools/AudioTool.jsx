export const AUDIO_TOOLS = {
    convert_audio: {
        title: 'Audio Conversion',
        icon: (
            <svg className="h-6 w-6 fill-green-500" viewBox="0 0 640 640">
                <path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM389.8 307.7C380.7 301.4 368.3 303.6 362 312.7C355.7 321.8 357.9 334.2 367 340.5C390.9 357.2 406.4 384.8 406.4 416C406.4 447.2 390.8 474.9 367 491.5C357.9 497.8 355.7 510.3 362 519.3C368.3 528.3 380.8 530.6 389.8 524.3C423.9 500.5 446.4 460.8 446.4 416C446.4 371.2 424 331.5 389.8 307.7zM208 376C199.2 376 192 383.2 192 392L192 440C192 448.8 199.2 456 208 456L232 456L259.2 490C262.2 493.8 266.8 496 271.7 496L272 496C280.8 496 288 488.8 288 480L288 352C288 343.2 280.8 336 272 336L271.7 336C266.8 336 262.2 338.2 259.2 342L232 376L208 376zM336 448.2C336 458.9 346.5 466.4 354.9 459.8C367.8 449.5 376 433.7 376 416C376 398.3 367.8 382.5 354.9 372.2C346.5 365.5 336 373.1 336 383.8L336 448.3z" />
            </svg>
        ),
        badge: 'MP3, WAV, FLAC',
        accepts: '.mp3,.wav,.flac,.m4a,.aac',
        dropzoneText: 'Drop your audio files here',
        dropzoneSubtext: 'or click to browse (MP3, WAV, FLAC, M4A)',
        showConversionSettings: true,
        showAudioEffects: true,
        submitText: 'Convert Audio',
        submitIcon: (
            <svg className="h-5 w-5 fill-white" viewBox="0 0 640 640">
                <path d="M566.6 214.6L470.6 310.6C461.4 319.8 447.7 322.5 435.7 317.5C423.7 312.5 416 300.9 416 288L416 224L96 224C78.3 224 64 209.7 64 192C64 174.3 78.3 160 96 160L416 160L416 96C416 83.1 423.8 71.4 435.8 66.4C447.8 61.4 461.5 64.2 470.7 73.3L566.7 169.3C579.2 181.8 579.2 202.1 566.7 214.6zM169.3 566.6L73.3 470.6C60.8 458.1 60.8 437.8 73.3 425.3L169.3 329.3C178.5 320.1 192.2 317.4 204.2 322.4C216.2 327.4 224 339.1 224 352L224 416L544 416C561.7 416 576 430.3 576 448C576 465.7 561.7 480 544 480L224 480L224 544C224 556.9 216.2 568.6 204.2 573.6C192.2 578.6 178.5 575.8 169.3 566.7z" />
            </svg>
        )
    },
    audio_join: {
        title: 'Audio Join',
        icon: (
            <svg className="h-6 w-6 fill-blue-500" viewBox="0 0 640 640">
                <path d="M532 71C539.6 77.1 544 86.3 544 96L544 400C544 444.2 501 480 448 480C395 480 352 444.2 352 400C352 355.8 395 320 448 320C459.2 320 470 321.6 480 324.6L480 207.9L256 257.7L256 464C256 508.2 213 544 160 544C107 544 64 508.2 64 464C64 419.8 107 384 160 384C171.2 384 182 385.6 192 388.6L192 160C192 145 202.4 132 217.1 128.8L505.1 64.8C514.6 62.7 524.5 65 532.1 71.1z" />
            </svg>
        ),
        badge: 'Join multiple files',
        accepts: '.mp3,.wav,.flac,.m4a,.aac',
        dropzoneText: 'Drop audio files to join',
        dropzoneSubtext: 'Files will be joined in the order you upload them',
        showConversionSettings: false,
        showAudioEffects: false,
        submitText: 'Join Audio',
        submitIcon: (
            <svg className="h-5 w-5 fill-white" viewBox="0 0 640 640">
                <path d="M566.6 214.6L470.6 310.6C461.4 319.8 447.7 322.5 435.7 317.5C423.7 312.5 416 300.9 416 288L416 224L96 224C78.3 224 64 209.7 64 192C64 174.3 78.3 160 96 160L416 160L416 96C416 83.1 423.8 71.4 435.8 66.4C447.8 61.4 461.5 64.2 470.7 73.3L566.7 169.3C579.2 181.8 579.2 202.1 566.7 214.6z" />
            </svg>
        )
    },
    extract_audio: {
        title: 'Extract Audio',
        icon: (
            <svg className="h-6 w-6 fill-purple-500" viewBox="0 0 640 640">
                <path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5z" />
            </svg>
        ),
        badge: 'From Video',
        accepts: '.mp4,.avi,.mov,.mkv,.webm',
        dropzoneText: 'Drop video files here',
        dropzoneSubtext: 'or click to browse (MP4, AVI, MOV, MKV)',
        showConversionSettings: true,
        showAudioEffects: false,
        submitText: 'Extract Audio',
        submitIcon: (
            <svg className="h-5 w-5 fill-white" viewBox="0 0 640 640">
                <path d="M176 544C96.5 544 32 479.5 32 400C32 336.6 73 282.8 129.9 263.5C128.6 255.8 128 248 128 240C128 160.5 192.5 96 272 96C327.4 96 375.5 127.3 399.6 173.1C413.8 164.8 430.4 160 448 160C501 160 544 203 544 256C544 271.7 540.2 286.6 533.5 299.7C577.5 320 608 364.4 608 416C608 486.7 550.7 544 480 544L176 544zM337 255C327.6 245.6 312.4 245.6 303.1 255L231.1 327C221.7 336.4 221.7 351.6 231.1 360.9C240.5 370.2 255.7 370.3 265 360.9L296 329.9L296 432C296 445.3 306.7 456 320 456C333.3 456 344 445.3 344 432L344 329.9L375 360.9C384.4 370.3 399.6 370.3 408.9 360.9C418.2 351.5 418.3 336.3 408.9 327L336.9 255z" />
            </svg>
        )
    }
};

// MediaTool.jsx - Unified component for Audio, Image, and future media types
import { useState } from 'react';

// Centralized configuration for all media tools
const TOOLS_CONFIG = {
    // Audio Tools
    convert_audio: {
        category: 'audio',
        title: 'Audio Conversion',
        color: 'green',
        badge: 'MP3, WAV, FLAC',
        accepts: '.mp3,.wav,.flac,.m4a,.aac',
        dropzoneText: 'Drop your audio files here',
        dropzoneSubtext: 'or click to browse (MP3, WAV, FLAC, M4A)',
        submitText: 'Convert Audio',
        settings: ['format', 'bitrate', 'sampleRate'],
        effects: ['noiseReduce', 'normalize', 'compressor', 'equalizer'],
        icon: (
            <svg className="h-6 w-6 fill-green-500" viewBox="0 0 640 640">
                <path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM389.8 307.7C380.7 301.4 368.3 303.6 362 312.7C355.7 321.8 357.9 334.2 367 340.5C390.9 357.2 406.4 384.8 406.4 416C406.4 447.2 390.8 474.9 367 491.5C357.9 497.8 355.7 510.3 362 519.3C368.3 528.3 380.8 530.6 389.8 524.3C423.9 500.5 446.4 460.8 446.4 416C446.4 371.2 424 331.5 389.8 307.7zM208 376C199.2 376 192 383.2 192 392L192 440C192 448.8 199.2 456 208 456L232 456L259.2 490C262.2 493.8 266.8 496 271.7 496L272 496C280.8 496 288 488.8 288 480L288 352C288 343.2 280.8 336 272 336L271.7 336C266.8 336 262.2 338.2 259.2 342L232 376L208 376zM336 448.2C336 458.9 346.5 466.4 354.9 459.8C367.8 449.5 376 433.7 376 416C376 398.3 367.8 382.5 354.9 372.2C346.5 365.5 336 373.1 336 383.8L336 448.3z" />
            </svg>
        ),
        submitIcon: (
            <svg className="h-5 w-5 fill-white" viewBox="0 0 640 640">
                <path d="M566.6 214.6L470.6 310.6C461.4 319.8 447.7 322.5 435.7 317.5C423.7 312.5 416 300.9 416 288L416 224L96 224C78.3 224 64 209.7 64 192C64 174.3 78.3 160 96 160L416 160L416 96C416 83.1 423.8 71.4 435.8 66.4C447.8 61.4 461.5 64.2 470.7 73.3L566.7 169.3C579.2 181.8 579.2 202.1 566.7 214.6zM169.3 566.6L73.3 470.6C60.8 458.1 60.8 437.8 73.3 425.3L169.3 329.3C178.5 320.1 192.2 317.4 204.2 322.4C216.2 327.4 224 339.1 224 352L224 416L544 416C561.7 416 576 430.3 576 448C576 465.7 561.7 480 544 480L224 480L224 544C224 556.9 216.2 568.6 204.2 573.6C192.2 578.6 178.5 575.8 169.3 566.7z" />
            </svg>
        )
    },
    audio_join: {
        category: 'audio',
        title: 'Audio Join',
        color: 'green',
        badge: 'Join multiple files',
        accepts: '.mp3,.wav,.flac,.m4a,.aac',
        dropzoneText: 'Drop audio files to join',
        dropzoneSubtext: 'Files will be joined in the order you upload them',
        submitText: 'Join Audio',
        settings: [],
        effects: [],
        icon: (
            <svg className="h-6 w-6 fill-green-500" viewBox="0 0 640 640">
                <path d="M532 71C539.6 77.1 544 86.3 544 96L544 400C544 444.2 501 480 448 480C395 480 352 444.2 352 400C352 355.8 395 320 448 320C459.2 320 470 321.6 480 324.6L480 207.9L256 257.7L256 464C256 508.2 213 544 160 544C107 544 64 508.2 64 464C64 419.8 107 384 160 384C171.2 384 182 385.6 192 388.6L192 160C192 145 202.4 132 217.1 128.8L505.1 64.8C514.6 62.7 524.5 65 532.1 71.1z" />
            </svg>
        ),
        submitIcon: (
            <svg className="h-5 w-5 fill-white" viewBox="0 0 640 640">
                <path d="M566.6 214.6L470.6 310.6C461.4 319.8 447.7 322.5 435.7 317.5C423.7 312.5 416 300.9 416 288L416 224L96 224C78.3 224 64 209.7 64 192C64 174.3 78.3 160 96 160L416 160L416 96C416 83.1 423.8 71.4 435.8 66.4C447.8 61.4 461.5 64.2 470.7 73.3L566.7 169.3C579.2 181.8 579.2 202.1 566.7 214.6z" />
            </svg>
        )
    },
    extract_audio: {
        category: 'audio',
        title: 'Extract Audio',
        color: 'green',
        badge: 'From Video',
        accepts: '.mp4,.avi,.mov,.mkv,.webm',
        dropzoneText: 'Drop video files here',
        dropzoneSubtext: 'or click to browse (MP4, AVI, MOV, MKV)',
        submitText: 'Extract Audio',
        settings: ['format', 'bitrate', 'sampleRate'],
        effects: [],
        icon: (
            <svg className="h-6 w-6 fill-green-500" viewBox="0 0 640 640">
                <path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5z" />
            </svg>
        ),
        submitIcon: (
            <svg className="h-5 w-5 fill-white" viewBox="0 0 640 640">
                <path d="M176 544C96.5 544 32 479.5 32 400C32 336.6 73 282.8 129.9 263.5C128.6 255.8 128 248 128 240C128 160.5 192.5 96 272 96C327.4 96 375.5 127.3 399.6 173.1C413.8 164.8 430.4 160 448 160C501 160 544 203 544 256C544 271.7 540.2 286.6 533.5 299.7C577.5 320 608 364.4 608 416C608 486.7 550.7 544 480 544L176 544zM337 255C327.6 245.6 312.4 245.6 303.1 255L231.1 327C221.7 336.4 221.7 351.6 231.1 360.9C240.5 370.2 255.7 370.3 265 360.9L296 329.9L296 432C296 445.3 306.7 456 320 456C333.3 456 344 445.3 344 432L344 329.9L375 360.9C384.4 370.3 399.6 370.3 408.9 360.9C418.2 351.5 418.3 336.3 408.9 327L336.9 255z" />
            </svg>
        )
    },

    // Image Tools
    convert_image: {
        category: 'image',
        title: 'Image Conversion',
        color: 'red',
        badge: 'PNG, JPG, WEBP',
        accepts: '.png,.jpg,.jpeg,.webp,.gif,.bmp',
        dropzoneText: 'Drop your images here',
        dropzoneSubtext: 'or click to browse (PNG, JPG, WEBP, GIF)',
        submitText: 'Convert Images',
        settings: ['imageFormat', 'quality'],
        advanced: ['resize'],
        icon: (
            <svg className="h-7 w-7 fill-red-500" viewBox="0 0 640 640">
                <path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM224 176C250.5 176 272 197.5 272 224C272 250.5 250.5 272 224 272C197.5 272 176 250.5 176 224C176 197.5 197.5 176 224 176zM368 288C376.4 288 384.1 292.4 388.5 299.5L476.5 443.5C481 450.9 481.2 460.2 477 467.8C472.8 475.4 464.7 480 456 480L184 480C175.1 480 166.8 475 162.7 467.1C158.6 459.2 159.2 449.6 164.3 442.3L220.3 362.3C224.8 355.9 232.1 352.1 240 352.1C247.9 352.1 255.2 355.9 259.7 362.3L286.1 400.1L347.5 299.6C351.9 292.5 359.6 288.1 368 288.1z" />
            </svg>
        ),
        submitIcon: (
            <svg className="h-5 w-5 fill-white" viewBox="0 0 640 640">
                <path d="M544.1 256L552 256C565.3 256 576 245.3 576 232L576 88C576 78.3 570.2 69.5 561.2 65.8C552.2 62.1 541.9 64.2 535 71L483.3 122.8C439 86.1 382 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6C143.2 199.5 223.3 128 320 128C364.4 128 405.2 143 437.7 168.3L391 215C384.1 221.9 382.1 232.2 385.8 241.2C389.5 250.2 398.3 256 408 256L544.1 256zM573.5 356.5C576 339 563.8 322.8 546.4 320.3C529 317.8 512.7 330 510.2 347.4C496.9 440.4 416.8 511.9 320.1 511.9C275.7 511.9 234.9 496.9 202.4 471.6L249 425C255.9 418.1 257.9 407.8 254.2 398.8C250.5 389.8 241.7 384 232 384L88 384C74.7 384 64 394.7 64 408L64 552C64 561.7 69.8 570.5 78.8 574.2C87.8 577.9 98.1 575.8 105 569L156.8 517.2C201 553.9 258 576 320 576C449 576 555.7 480.6 573.4 356.5z" />
            </svg>
        )
    },
    image2pdf: {
        category: 'image',
        title: 'Image to PDF',
        color: 'red',
        badge: 'Images to PDF',
        accepts: '.png,.jpg,.jpeg,.webp,.gif,.bmp',
        dropzoneText: 'Drop images to convert',
        dropzoneSubtext: 'Images will be combined into a single PDF',
        submitText: 'Convert to PDF',
        settings: ['pageSize', 'orientation'],
        icon: (
            <svg className="h-7 w-7 fill-red-500" viewBox="0 0 640 640">
                <path d="M128 160C128 124.7 156.7 96 192 96L512 96C547.3 96 576 124.7 576 160L576 416C576 451.3 547.3 480 512 480L192 480C156.7 480 128 451.3 128 416L128 160zM56 192C69.3 192 80 202.7 80 216L80 512C80 520.8 87.2 528 96 528L456 528C469.3 528 480 538.7 480 552C480 565.3 469.3 576 456 576L96 576C60.7 576 32 547.3 32 512L32 216C32 202.7 42.7 192 56 192z" />
            </svg>
        ),
        submitIcon: (
            <svg className="h-5 w-5 fill-white" viewBox="0 0 640 640">
                <path d="M416 384C416 398.8 403.8 410.8 389.1 416.1C374.4 421.3 358.3 418.2 346.8 408.6L288 358.4L288 480C288 497.7 273.7 512 256 512C238.3 512 224 497.7 224 480L224 358.4L165.2 408.6C153.7 418.2 137.6 421.3 122.9 416.1C108.2 410.8 96 398.8 96 384L96 160C96 142.3 110.3 128 128 128L384 128C401.7 128 416 142.3 416 160L416 384z" />
            </svg>
        )
    },
    image2word: {
        category: 'image',
        title: 'Image to Word',
        color: 'red',
        badge: 'OCR to DOCX',
        accepts: '.png,.jpg,.jpeg,.webp,.gif,.bmp',
        dropzoneText: 'Drop images with text',
        dropzoneSubtext: 'Text will be extracted and converted to Word document',
        submitText: 'Extract to Word',
        settings: ['language', 'preserveFormatting'],
        icon: (
            <svg className="h-7 w-7 fill-red-500" viewBox="0 0 640 640">
                <path d="M224 128C224 110.3 238.3 96 256 96H480C497.7 96 512 110.3 512 128V384C512 401.7 497.7 416 480 416H256C238.3 416 224 401.7 224 384V128zM160 160C160 142.3 174.3 128 192 128V416C192 469 234.1 512 288 512H480C497.7 512 512 526.3 512 544C512 561.7 497.7 576 480 576H288C199.6 576 128 504.4 128 416V160C128 142.3 142.3 128 160 128z" />
            </svg>
        ),
        submitIcon: (
            <svg className="h-5 w-5 fill-white" viewBox="0 0 640 640">
                <path d="M416 384C416 398.8 403.8 410.8 389.1 416.1C374.4 421.3 358.3 418.2 346.8 408.6L288 358.4L288 480C288 497.7 273.7 512 256 512C238.3 512 224 497.7 224 480L224 358.4L165.2 408.6C153.7 418.2 137.6 421.3 122.9 416.1C108.2 410.8 96 398.8 96 384L96 160C96 142.3 110.3 128 128 128L384 128C401.7 128 416 142.3 416 160L416 384z" />
            </svg>
        )
    },
    image2gray: {
        category: 'image',
        title: 'Grayscale',
        color: 'red',
        badge: 'B&W Conversion',
        accepts: '.png,.jpg,.jpeg,.webp,.gif,.bmp',
        dropzoneText: 'Drop images to convert',
        dropzoneSubtext: 'Convert colorful images to grayscale/black & white',
        submitText: 'Convert to Grayscale',
        settings: ['intensity'],
        icon: (
            <svg className="h-7 w-7 fill-red-500" viewBox="0 0 640 640">
                <path d="M320 64C145.3 64 0 209.3 0 384C0 558.7 145.3 704 320 704C494.7 704 640 558.7 640 384C640 209.3 494.7 64 320 64zM320 640C181.5 640 64 522.5 64 384C64 245.5 181.5 128 320 128C458.5 128 576 245.5 576 384C576 522.5 458.5 640 320 640zM320 192C214.3 192 128 278.3 128 384C128 489.7 214.3 576 320 576C425.7 576 512 489.7 512 384C512 278.3 425.7 192 320 192z" />
            </svg>
        ),
        submitIcon: (
            <svg className="h-5 w-5 fill-white" viewBox="0 0 640 640">
                <path d="M544.1 256L552 256C565.3 256 576 245.3 576 232L576 88C576 78.3 570.2 69.5 561.2 65.8C552.2 62.1 541.9 64.2 535 71L483.3 122.8C439 86.1 382 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6C143.2 199.5 223.3 128 320 128C364.4 128 405.2 143 437.7 168.3L391 215C384.1 221.9 382.1 232.2 385.8 241.2C389.5 250.2 398.3 256 408 256L544.1 256z" />
            </svg>
        )
    }
};


// Dynamic settings renderer based on tool configuration
const SettingsPanel = ({ settings, category }) => {
    const renderSetting = (setting) => {
        switch (setting) {
            // Audio settings
            case 'format':
                return (
                    <div key={setting}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Format</label>
                        <select name="target_format" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="mp3">MP3</option>
                            <option value="wav">WAV</option>
                            <option value="flac">FLAC</option>
                            <option value="m4a">M4A</option>
                            <option value="aac">AAC</option>
                        </select>
                    </div>
                );
            case 'bitrate':
                return (
                    <div key={setting}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bitrate</label>
                        <select name="bitrate" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="128">128 kbps</option>
                            <option value="192">192 kbps</option>
                            <option value="256">256 kbps</option>
                            <option value="320">320 kbps</option>
                        </select>
                    </div>
                );
            case 'sampleRate':
                return (
                    <div key={setting}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sample Rate</label>
                        <select name="sample_rate" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="44100">44.1 kHz</option>
                            <option value="48000">48 kHz</option>
                            <option value="96000">96 kHz</option>
                        </select>
                    </div>
                );

            // Image settings
            case 'imageFormat':
                return (
                    <div key={setting}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Format</label>
                        <select name="target_format" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                            <option value="webp">WEBP</option>
                            <option value="gif">GIF</option>
                            <option value="bmp">BMP</option>
                        </select>
                    </div>
                );
            case 'quality':
                return (
                    <div key={setting}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quality</label>
                        <input type="range" name="quality" min="1" max="100" defaultValue="85" className="w-full" />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Low</span>
                            <span>85%</span>
                            <span>High</span>
                        </div>
                    </div>
                );
            case 'pageSize':
                return (
                    <div key={setting}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Size</label>
                        <select name="page_size" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="a4">A4</option>
                            <option value="letter">Letter</option>
                            <option value="legal">Legal</option>
                        </select>
                    </div>
                );
            case 'orientation':
                return (
                    <div key={setting}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Orientation</label>
                        <select name="orientation" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                );
            case 'language':
                return (
                    <div key={setting}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">OCR Language</label>
                        <select name="language" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="eng">English</option>
                            <option value="fra">French</option>
                            <option value="deu">German</option>
                            <option value="spa">Spanish</option>
                        </select>
                    </div>
                );
            case 'preserveFormatting':
                return (
                    <div key={setting} className="flex items-center">
                        <input type="checkbox" name="preserve_formatting" id="preserve_formatting" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                        <label htmlFor="preserve_formatting" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Preserve Formatting</label>
                    </div>
                );
            case 'intensity':
                return (
                    <div key={setting}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grayscale Intensity</label>
                        <input type="range" name="intensity" min="0" max="100" defaultValue="100" className="w-full" />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Light</span>
                            <span>100%</span>
                            <span>Dark</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (!settings || settings.length === 0) return null;

    return (
        <div className={`grid grid-cols-1 ${settings.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
            {settings.map(renderSetting)}
        </div>
    );
};

// Advanced options renderer
const AdvancedOptions = ({ advanced, category, isOpen, onToggle }) => {
    if (!advanced || advanced.length === 0) return null;

    const renderAdvanced = (option) => {
        switch (option) {
            case 'resize':
                return (
                    <div key={option} className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Width</label>
                            <input type="number" name="width" placeholder="Auto" className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Height</label>
                            <input type="number" name="height" placeholder="Auto" className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Size Limit</label>
                            <input type="text" name="size_limit" placeholder="2MB" className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <button type="button" className="flex items-center justify-between w-full cursor-pointer" onClick={onToggle}>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category === 'image' ? 'Resize Options' : 'Advanced Options'}
                </span>
                <ChevronIcon rotated={isOpen} />
            </button>
            {isOpen && <div className="mt-3">{advanced.map(renderAdvanced)}</div>}
        </div>
    );
};

// Audio effects renderer
const AudioEffects = ({ effects, isOpen, onToggle }) => {
    if (!effects || effects.length === 0) return null;

    const effectLabels = {
        noiseReduce: 'Noise Reduce',
        normalize: 'Normalize',
        compressor: 'Compressor',
        equalizer: 'Equalizer'
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <button type="button" className="flex items-center justify-between w-full cursor-pointer" onClick={onToggle}>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Audio Effects</span>
                <ChevronIcon rotated={isOpen} />
            </button>
            {isOpen && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {effects.map((effect) => (
                        <label key={effect} className="flex items-center cursor-pointer">
                            <input type="checkbox" name={`effect_${effect}`} className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                            <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">{effectLabels[effect]}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

// Main MediaTool component
export const MediaTool = ({ tool }) => {
    const config = TOOLS_CONFIG[tool.id];
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [files, setFiles] = useState([]);

    if (!config) return null;

    const { category, color, title, badge, accepts, dropzoneText, dropzoneSubtext, submitText, settings, effects, advanced, icon, submitIcon } = config;

    const colorClasses = {
        green: {
            badge: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
            button: 'bg-green-600 hover:bg-green-700',
            checkbox: 'text-green-600 focus:ring-green-500'
        },
        red: {
            badge: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
            button: 'bg-red-600 hover:bg-red-700',
            checkbox: 'text-red-600 focus:ring-red-500'
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log('Submitting:', tool.id, Object.fromEntries(formData));
        // API call based on tool.id
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const clearForm = () => {
        setFiles([]);
        setShowAdvanced(false);
    };

    return (
        <section className="mt-8 w-full sm:w-fit sm:min-w-[70%] sm:max-w-full">
            <div className="tool-interface">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="flex gap-2 text-xl font-semibold text-gray-900 dark:text-white items-center">
                        {icon}
                        {title}
                    </h3>
                    <span className={`${colorClasses[color].badge} text-xs px-2 py-1 rounded`}>
                        {badge}
                    </span>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* File Upload */}
                    <div>
                        <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 items-center">
                            <UploadIcon />
                            Upload {category === 'image' ? 'Images' : 'Files'}
                        </label>
                        <div className="file-drop-zone rounded-lg p-6 text-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                            <div className="drop-placeholder">
                                <span className="flex justify-center">
                                    <CloudIcon />
                                </span>
                                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                                    {dropzoneText}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {dropzoneSubtext}
                                </p>
                            </div>
                            {files.length > 0 && (
                                <div className="file-list mt-4 space-y-2">
                                    {files.map((file, idx) => (
                                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded flex justify-between items-center">
                                            <span>{file.name}</span>
                                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            name="files"
                            multiple
                            accept={accepts}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Dynamic Settings */}
                    <SettingsPanel settings={settings} category={category} />

                    {/* Audio Effects (Audio only) */}
                    {category === 'audio' && effects && (
                        <AudioEffects
                            effects={effects}
                            isOpen={showAdvanced}
                            onToggle={() => setShowAdvanced(!showAdvanced)}
                        />
                    )}

                    {/* Advanced Options (Image only) */}
                    {category === 'image' && advanced && (
                        <AdvancedOptions
                            advanced={advanced}
                            category={category}
                            isOpen={showAdvanced}
                            onToggle={() => setShowAdvanced(!showAdvanced)}
                        />
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className={`flex-1 ${colorClasses[color].button} text-white font-medium py-3 px-6 rounded-lg transition-colors flex justify-center items-center gap-2`}
                        >
                            {submitIcon}
                            {submitText}
                        </button>
                        <button
                            type="button"
                            onClick={clearForm}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};
