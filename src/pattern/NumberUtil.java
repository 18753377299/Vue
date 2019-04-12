package pattern;

import java.util.regex.Pattern;

public class NumberUtil {
    /**
     * 判断一个字符串是否是数字。
     * 
     * @param string
     * @return
     */
    public static boolean isNumber(String string) {
        if (string == null)
            return false;
//        String regExp = "^[1-9][0-9]*(\\.[0-9]{1,"+2+"})?$";
//        String regExp = "^-?\\d+(\\.\\d+)?$";
//        String regExp = "([1-9]\\d*|0)(\\.\\d{0,0})?";
        String regExp = "(^-?[1-9]\\d*|0)(\\.\\d+)?";
        Pattern pattern = Pattern.compile(regExp);
        return pattern.matcher(string).matches();
    }

    private static void isNumberTest() {
//        System.out.println(isNumber("123"));
//        System.out.println(isNumber("-123.456"));
//        System.out.println(isNumber("123成宇佳456"));
//        System.out.println(isNumber("123.456"));
//        System.out.println(isNumber("123.45"));
//        System.out.println(isNumber("0.45"));
//        System.out.println(isNumber("0232.45"));
        System.out.println(isNumberByte("44010411"));
        
    }
    public static boolean isNumberByte(String string) {
        if (string == null)
            return false;
//        String regExp = "^[1-9][0-9]*(\\.[0-9]{1,"+2+"})?$";
//        String regExp = "^-?\\d+(\\.\\d+)?$";
//        String regExp = "([1-9]\\d*|0)(\\.\\d{0,0})?";
        String regExp = "^[0-9]{8}";
//        Pattern pattern = Pattern.compile(regExp);
//        return pattern.matcher(string).matches();
        String val = string.toString().trim();
		if(!val.matches(regExp)){
			return false;
		}
		return true;
//        return  string.matches(regExp);
    }

    public static void main(String[] args) {
        isNumberTest();
    }
}