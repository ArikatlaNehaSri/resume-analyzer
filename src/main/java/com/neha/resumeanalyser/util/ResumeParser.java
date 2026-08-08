package com.neha.resumeanalyser.util;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

public class ResumeParser {

    public String extractText(MultipartFile file) throws IOException {

        String fileName = file.getOriginalFilename();

        if (fileName == null) {
            throw new IllegalArgumentException("Invalid file name.");
        }

        String lowerCaseFileName = fileName.toLowerCase();

        if (lowerCaseFileName.endsWith(".pdf")) {

            return extractPdfText(file);

        } else if (lowerCaseFileName.endsWith(".docx")) {

            return extractDocxText(file);

        } else {

            throw new IllegalArgumentException(
                    "Only PDF and DOCX files are supported."
            );
        }
    }


    private String extractPdfText(MultipartFile file)
            throws IOException {

        byte[] fileBytes = file.getBytes();

        try (PDDocument document = Loader.loadPDF(fileBytes)) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(document);
        }
    }


    private String extractDocxText(MultipartFile file)
            throws IOException {

        StringBuilder text = new StringBuilder();

        try (InputStream inputStream = file.getInputStream();
             XWPFDocument document = new XWPFDocument(inputStream)) {

            for (XWPFParagraph paragraph : document.getParagraphs()) {

                String paragraphText = paragraph.getText();

                if (!paragraphText.isBlank()) {

                    text.append(paragraphText)
                            .append(System.lineSeparator());
                }
            }
        }

        return text.toString();
    }
}