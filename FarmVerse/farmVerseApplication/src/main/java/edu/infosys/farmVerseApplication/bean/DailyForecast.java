package edu.infosys.farmVerseApplication.bean;

public class DailyForecast {
    private String day;
    private String icon;
    private int tempMax;
    private int tempMin;
    private String rain;
    private String advice;

    public DailyForecast() {
        super();
    }

    public DailyForecast(String day, String icon, int tempMax, int tempMin, String rain, String advice) {
        super();
        this.day = day;
        this.icon = icon;
        this.tempMax = tempMax;
        this.tempMin = tempMin;
        this.rain = rain;
        this.advice = advice;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public int getTempMax() {
        return tempMax;
    }

    public void setTempMax(int tempMax) {
        this.tempMax = tempMax;
    }

    public int getTempMin() {
        return tempMin;
    }

    public void setTempMin(int tempMin) {
        this.tempMin = tempMin;
    }

    public String getRain() {
        return rain;
    }

    public void setRain(String rain) {
        this.rain = rain;
    }

    public String getAdvice() {
        return advice;
    }

    public void setAdvice(String advice) {
        this.advice = advice;
    }
}
