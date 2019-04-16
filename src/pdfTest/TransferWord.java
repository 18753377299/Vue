package pdfTest;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;

import com.deepoove.poi.XWPFTemplate;

public class TransferWord {
	public static void main(String []args) {
		try {
			
			String sourceFile = "F:/riskcontrol/riskcontrol_file/eee.docx";
//           String sourceFile = "F:/riskcontrol/riskcontrol_file/downloadFile/eee.docx";
           String destFile="F:/riskcontrol/riskcontrol_file/out_template.docx";
         
			//核心API采用了极简设计，只需要一行代码
			XWPFTemplate template = XWPFTemplate.compile(sourceFile).render(new HashMap<String, Object>(){{
			        put("name", "Poi-tl 模板引擎");
			}});
			FileOutputStream out = new FileOutputStream(destFile);
			template.write(out);
			out.flush();
			out.close();
			template.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
