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
import jakarta.annotation.PostConstruct;
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

        String farmName = (farm != null && farm.getFarmName() != null) ? farm.getFarmName() : "Plot #" + crop.getFarmId();
        String soil = (farm != null && farm.getSoil() != null) ? farm.getSoil() : "General";
        String timestamp = LocalDateTime.now().format(DATE_FORMATTER);

        double recordedYield = (crop.getYield() != null && crop.getYield() > 0.0)
                ? crop.getYield()
                : calculateFallbackYield(crop.getCropName(), soil);
        crop.setYield(recordedYield);

        // Find existing row for this cropId if it was already recorded
        Row row = null;
        String targetCropId = crop.getCropId();
        if (targetCropId != null && !targetCropId.trim().isEmpty()) {
            for (int r = 1; r <= sheet.getLastRowNum(); r++) {
                Row currRow = sheet.getRow(r);
                if (currRow != null) {
                    Cell idCell = currRow.getCell(2);
                    if (idCell != null && targetCropId.equalsIgnoreCase(idCell.getStringCellValue().trim())) {
                        row = currRow;
                        break;
                    }
                }
            }
        }

        int slNo;
        if (row != null) {
            try {
                slNo = Integer.parseInt(row.getCell(0).getStringCellValue());
            } catch (Exception e) {
                slNo = row.getRowNum();
            }
        } else {
            int nextRowNum = sheet.getLastRowNum() + 1;
            row = sheet.createRow(nextRowNum);
            slNo = nextRowNum;
        }

        CellStyle dataStyle = workbook.createCellStyle();
        Font dataFont = workbook.createFont();
        dataFont.setFontHeightInPoints((short) 10);
        dataStyle.setFont(dataFont);

        int col = 0;
        createCell(row, col++, String.valueOf(slNo), dataStyle);
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
        createCell(row, col++, String.format(java.util.Locale.US, "%.1f", recordedYield), dataStyle);
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

    public static double calculateFallbackYield(String cropName, String soil) {
        String name = cropName != null ? cropName.toLowerCase() : "";
        String s = soil != null ? soil.toLowerCase() : "";
        double base = 3.0;
        if (name.contains("cauliflower") || name.contains("cabbage")) base = 9.0;
        else if (name.contains("carrot")) base = 8.5;
        else if (name.contains("tomato")) base = 12.0;
        else if (name.contains("potato")) base = 10.5;
        else if (name.contains("rice") || name.contains("paddy")) base = 4.2;
        else if (name.contains("wheat")) base = 3.6;
        else if (name.contains("corn") || name.contains("maize")) base = 4.5;
        else if (name.contains("cotton")) base = 1.8;
        else if (name.contains("sugarcane")) base = 35.0;
        else if (name.contains("bean") || name.contains("soy")) base = 2.5;

        if (s.contains("loam") || s.contains("alluvial")) base *= 1.15;
        else if (s.contains("black") || s.contains("clay")) base *= 1.05;
        else if (s.contains("sandy") || s.contains("lateriate") || s.contains("laterite")) base *= 0.90;

        return Math.round(base * 10.0) / 10.0;
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

    @PostConstruct
    public synchronized void sanitizeAndFixExistingExcelYields() {
        try {
            File file = getExcelFile();
            if (!file.exists()) return;

            Workbook workbook;
            try (FileInputStream fis = new FileInputStream(file)) {
                workbook = new XSSFWorkbook(fis);
            }
            Sheet sheet = workbook.getSheet("Permanent Crop Archive");
            if (sheet == null) {
                workbook.close();
                return;
            }

            boolean modified = false;
            for (int r = 1; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) continue;
                Cell cropNameCell = row.getCell(3);
                Cell soilCell = row.getCell(6);
                Cell yieldCell = row.getCell(11);

                String cropName = cropNameCell != null ? cropNameCell.getStringCellValue() : "";
                String soil = soilCell != null ? soilCell.getStringCellValue() : "General";

                double currentYield = 0.0;
                if (yieldCell != null) {
                    try {
                        currentYield = Double.parseDouble(yieldCell.getStringCellValue().trim());
                    } catch (Exception e) {
                        try {
                            currentYield = yieldCell.getNumericCellValue();
                        } catch (Exception ignored) {}
                    }
                }

                if (currentYield <= 0.0) {
                    double fixedYield = calculateFallbackYield(cropName, soil);
                    if (yieldCell == null) {
                        yieldCell = row.createCell(11);
                    }
                    yieldCell.setCellValue(String.format(java.util.Locale.US, "%.1f", fixedYield));
                    modified = true;
                }
            }

            if (modified) {
                try (FileOutputStream fos = new FileOutputStream(file)) {
                    workbook.write(fos);
                }
                System.out.println("✓ Existing crop Excel archive updated with calculated non-zero yields!");
            }
            workbook.close();
        } catch (Exception e) {
            System.err.println("Notice: Could not automatically update existing Excel file (it may be open in Excel): " + e.getMessage());
        }
    }

    public File getGeneratedExcelFile() {
        sanitizeAndFixExistingExcelYields();
        return getExcelFile();
    }
}
