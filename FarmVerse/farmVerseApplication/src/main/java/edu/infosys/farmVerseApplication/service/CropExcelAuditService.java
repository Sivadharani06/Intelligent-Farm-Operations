package edu.infosys.farmVerseApplication.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.Crop;
import edu.infosys.farmVerseApplication.bean.Farm;

@Service
public class CropExcelAuditService {

    private static final String EXCEL_FILE_NAME = "crop_master_history.xlsx";
    private static final String CSV_FILE_NAME = "crop_master_history.csv";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final String[] HEADERS = {
        "Sl. No",
        "Timestamp Recorded",
        "Crop ID",
        "Crop Variety / Name",
        "Farm Plot ID",
        "Farm Name",
        "Soil Type",
        "Farmer Username",
        "Cultivated Area (Acres)",
        "Sown Month & Year",
        "Harvest Month & Year",
        "Recorded Yield (Tons)",
        "Audit Status"
    };

    private File getExcelFile() {
        return new File(System.getProperty("user.dir"), EXCEL_FILE_NAME);
    }

    private File getCsvFile() {
        return new File(System.getProperty("user.dir"), CSV_FILE_NAME);
    }

    /**
     * Appends a newly registered or updated crop into the permanent Excel sheet.
     * Even if the crop is later deleted from the database, this Excel record is permanently retained.
     */
    public synchronized void appendCropRecord(Crop crop, Farm farm) {
        try {
            saveToExcel(crop, farm);
        } catch (Exception e) {
            System.err.println("Warning: Failed to append to Excel file: " + e.getMessage());
        }

        try {
            saveToCsv(crop, farm);
        } catch (Exception e) {
            System.err.println("Warning: Failed to append to CSV backup: " + e.getMessage());
        }
    }

    private void saveToExcel(Crop crop, Farm farm) throws Exception {
        File file = getExcelFile();
        Workbook workbook;
        Sheet sheet;

        boolean isNewFile = !file.exists();

        if (isNewFile) {
            workbook = new XSSFWorkbook();
            sheet = workbook.createSheet("Permanent Crop Archive");
            createHeaderRow(workbook, sheet);
        } else {
            try (FileInputStream fis = new FileInputStream(file)) {
                workbook = new XSSFWorkbook(fis);
            }
            sheet = workbook.getSheet("Permanent Crop Archive");
            if (sheet == null) {
                sheet = workbook.createSheet("Permanent Crop Archive");
                createHeaderRow(workbook, sheet);
            }
        }

        int nextRowNum = sheet.getLastRowNum() + 1;
        Row row = sheet.createRow(nextRowNum);

        CellStyle dataStyle = workbook.createCellStyle();
        Font dataFont = workbook.createFont();
        dataFont.setFontHeightInPoints((short) 10);
        dataStyle.setFont(dataFont);

        String farmName = (farm != null && farm.getFarmName() != null) ? farm.getFarmName() : "Plot #" + crop.getFarmId();
        String soil = (farm != null && farm.getSoil() != null) ? farm.getSoil() : "General";
        String timestamp = LocalDateTime.now().format(DATE_FORMATTER);

        int col = 0;
        createCell(row, col++, String.valueOf(nextRowNum), dataStyle);
        createCell(row, col++, timestamp, dataStyle);
        createCell(row, col++, crop.getCropId() != null ? crop.getCropId() : "N/A", dataStyle);
        createCell(row, col++, crop.getCropName() != null ? crop.getCropName() : "N/A", dataStyle);
        createCell(row, col++, crop.getFarmId() != null ? String.valueOf(crop.getFarmId()) : "N/A", dataStyle);
        createCell(row, col++, farmName, dataStyle);
        createCell(row, col++, soil, dataStyle);
        createCell(row, col++, crop.getUsername() != null ? crop.getUsername() : "farmer", dataStyle);
        createCell(row, col++, crop.getCropArea() != null ? String.valueOf(crop.getCropArea()) : "0.0", dataStyle);
        createCell(row, col++, crop.getSownMonthYear() != null ? crop.getSownMonthYear() : "N/A", dataStyle);
        createCell(row, col++, crop.getHarvestMonthYear() != null ? crop.getHarvestMonthYear() : "N/A", dataStyle);
        createCell(row, col++, crop.getYield() != null ? String.valueOf(crop.getYield()) : "0.0", dataStyle);
        createCell(row, col++, "PERMANENT ARCHIVE (RETAINED)", dataStyle);

        for (int i = 0; i < HEADERS.length; i++) {
            sheet.autoSizeColumn(i);
        }

        try (FileOutputStream fos = new FileOutputStream(file)) {
            workbook.write(fos);
        }
        workbook.close();
        System.out.println("✓ Crop record successfully archived in Excel: " + file.getAbsolutePath());
    }

    private void createHeaderRow(Workbook workbook, Sheet sheet) {
        Row headerRow = sheet.createRow(0);
        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFillForegroundColor(IndexedColors.TEAL.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        font.setFontHeightInPoints((short) 11);
        headerStyle.setFont(font);

        for (int i = 0; i < HEADERS.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(HEADERS[i]);
            cell.setCellStyle(headerStyle);
        }
    }

    private void createCell(Row row, int column, String value, CellStyle style) {
        Cell cell = row.createCell(column);
        cell.setCellValue(value);
        if (style != null) {
            cell.setCellStyle(style);
        }
    }

    private void saveToCsv(Crop crop, Farm farm) throws Exception {
        File file = getCsvFile();
        boolean isNewFile = !file.exists();

        try (PrintWriter pw = new PrintWriter(new FileWriter(file, true))) {
            if (isNewFile) {
                pw.println(String.join(",", HEADERS));
            }

            String farmName = (farm != null && farm.getFarmName() != null) ? farm.getFarmName().replace(",", " ") : "Plot #" + crop.getFarmId();
            String soil = (farm != null && farm.getSoil() != null) ? farm.getSoil().replace(",", " ") : "General";
            String cropName = crop.getCropName() != null ? crop.getCropName().replace(",", " ") : "N/A";
            String timestamp = LocalDateTime.now().format(DATE_FORMATTER);

            pw.printf("%s,%s,%s,%s,%s,%s,%s,%s,%.2f,%s,%s,%.2f,%s%n",
                crop.getCropId() != null ? crop.getCropId() : "N/A",
                timestamp,
                crop.getCropId(),
                cropName,
                crop.getFarmId(),
                farmName,
                soil,
                crop.getUsername(),
                crop.getCropArea() != null ? crop.getCropArea() : 0.0,
                crop.getSownMonthYear(),
                crop.getHarvestMonthYear(),
                crop.getYield() != null ? crop.getYield() : 0.0,
                "PERMANENT ARCHIVE (RETAINED)"
            );
        }
    }

    public File getGeneratedExcelFile() {
        return getExcelFile();
    }
}
