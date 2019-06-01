package pdfTest;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.deepoove.poi.XWPFTemplate;
import com.deepoove.poi.data.MiniTableRenderData;
import com.deepoove.poi.data.RowRenderData;
import com.deepoove.poi.data.TextRenderData;

public class TransferWord {
	public static void main(String []args) {
		try {
			
//			String sourceFile = "F:/riskcontrol/riskcontrol_file/mapwarnPush.docx";
			String sourceFile = "/F:/eclipse/MainFk/prprisk_zg-Back/src/main/webapp/WEB-INF/classes/com/picc/riskctrl/typhoonearlywarning/template/mapwarnPush.docx";
			
//          String sourceFile = "F:/riskcontrol/riskcontrol_file/downloadFile/eee.docx";
            String destFile="F:/riskcontrol/riskcontrol_file/out_template.docx";
            
            
            Map  map = new HashMap<String, Object>();
            
            String [] tableHeader ={"台风编号","标的经度","标的纬度","地址","险种","标的总保额","标的理赔次数"};
			TextRenderData  [] textRenderData  = new TextRenderData[tableHeader.length];
			List<RowRenderData> rowRenderDataList=new ArrayList<RowRenderData>();
			for(int i=0;i<tableHeader.length;i++){
				// 设置 表头样式
				TextRenderData data = new TextRenderData("FF8C00", tableHeader[i]);
				textRenderData[i] = data;
			}
			// 生成文档头
			RowRenderData header = RowRenderData.build(textRenderData);
			for(int i=0;i<10;i++){
				// 组织list数据
				String [] data =  new String [tableHeader.length];
				data[0] = "aaa";
				data[1] ="bbb";
				data[2] = "ccc";
				data[3] = "d";
				data[4] = "e";
				data[5] = "f";
				data[6] = "g";
				RowRenderData row = RowRenderData.build(data);
				rowRenderDataList.add(row);
			}
			 
			MiniTableRenderData miniTableRenderData = new MiniTableRenderData(header, rowRenderDataList);
			map.put("title", "标题1");
			map.put("table", miniTableRenderData);
    		// 生成文档头
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
