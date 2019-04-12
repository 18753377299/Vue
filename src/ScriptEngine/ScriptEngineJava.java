package ScriptEngine;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月12日 下午5:08:02
 * @version 1.0 
 * @parameter 
 * @since  java 使用 ScriptEngineManager 解析逻辑表达式
 * @return  */
public class ScriptEngineJava {
	public static void main(String []args){
		
		try {
			String str = "(a or b) and c";
			str = str.replaceAll("or", "||");
			str = str.replaceAll("and", "&&");
			System.out.println(str);
			ScriptEngineManager manager = new ScriptEngineManager();
			ScriptEngine engine = manager.getEngineByName("js");
			engine.put("a", true);
			engine.put("b", false);
			engine.put("c", true);
			Object result = engine.eval(str);
			System.out.println("结果类型:" + result.getClass().getName() + ",计算结果:" + result);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		
	}
}
