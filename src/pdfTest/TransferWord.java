package pdfTest;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import com.deepoove.poi.XWPFTemplate;
import com.deepoove.poi.data.MiniTableRenderData;
import com.deepoove.poi.data.RowRenderData;
import com.deepoove.poi.data.TextRenderData;

public class TransferWord {
	public static void main(String []args) {
		try {
			
			String sourceFile = "F:/riskcontrol/riskcontrol_file/eee.docx";
//           String sourceFile = "F:/riskcontrol/riskcontrol_file/downloadFile/eee.docx";
            String destFile="F:/riskcontrol/riskcontrol_file/out_template.docx";
            
            Map  map = new HashMap<String, Object>();
            map.put("name", "Poi-tl 模板引擎");
            
            RowRenderData header = RowRenderData.build(new TextRenderData("FF8C00", "姓名"), new TextRenderData("FF8C00", "学历"));

            RowRenderData row0 = RowRenderData.build("张三", "研究生");
            RowRenderData row1 = RowRenderData.build("李四", "博士");
            RowRenderData row2 = RowRenderData.build("王五", "博士后");

            map.put("table", new MiniTableRenderData(header, Arrays.asList(row0, row1, row2)));
			//核心API采用了极简设计，只需要一行代码
			XWPFTemplate template = XWPFTemplate.compile(sourceFile).render(map);
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
