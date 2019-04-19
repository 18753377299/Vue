package toPdf.test;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
 
public class InputDocx {
	private static InputDocx inputDocx;
 
	public static InputDocx getInputDocx() {
		if (inputDocx == null)
			inputDocx = new InputDocx();
		return inputDocx;
	}
 
	public String DocxToString(Map<String, Object> params, String wordUrl) {
		XWPFDocument doc = valueInputWord(params, wordUrl);
		if (doc == null)return "";
		
		return new XWPFWordExtractor(doc).getText();
 
	}
 
	public XWPFDocument valueInputWord(Map<String, Object> params, String wordUrl) {
		XWPFDocument doc;// word文档对象
		try {
			InputStream in_stream = new FileInputStream(wordUrl);// 文件流
			doc = new XWPFDocument(in_stream);
			replaceInPara(doc, params);
 
			// OutputStream os = new FileOutputStream("E:\\writejiekuanxieyi.docx");
			// doc.write(os);
			closeStream(in_stream);
			// closeStream(os);
			return doc;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
 
	/**
	 * 关闭输入流
	 * 
	 * @param is
	 */
	private void closeStream(InputStream is) {
		if (is != null) {
			try {
				is.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
 
	/**
	 * 关闭输出流
	 * 
	 * @param os
	 */
	private void closeStream(OutputStream os) {
		if (os != null) {
			try {
				os.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
 
	/**
	 * 替换段落里面的变量
	 * 
	 * @param doc
	 *            要替换的文档
	 * @param params
	 *            参数
	 */
	private void replaceInPara(XWPFDocument doc, Map<String, Object> params) {
		Iterator<XWPFParagraph> iterator = doc.getParagraphsIterator();
		XWPFParagraph para;
 
		while (iterator.hasNext()) {
			para = iterator.next();
			replaceInPara(para, params);
		}
	}
 
	/**
	 * 替换段落里面的变量
	 * 
	 * @param para
	 *            要替换的段落
	 * @param params
	 *            参数
	 */
	private void replaceInPara(XWPFParagraph para, Map<String, Object> params) {
		List<XWPFRun> runs;
		Matcher matcher;
		System.out.println("para::" + para.getParagraphText());
		if (matcher(para.getParagraphText()).find()) {
			runs = para.getRuns();
 
			for (int i = 0; i < runs.size(); i++) {
				XWPFRun run = runs.get(i);
				String runText = run.toString();
				System.out.println("runText:1:" + runText);
				matcher = matcher(runText);
				if (matcher.find()) {
					while ((matcher = matcher(runText)).find()) {
						runText = matcher.replaceFirst(String.valueOf(params.get(matcher.group(1))));
						System.out.println("runText::" + runText);
 
					}
					// 直接调用XWPFRun的setText()方法设置文本时，在底层会重新创建一个XWPFRun，把文本附加在当前文本后面，
					// 所以我们不能直接设值，需要先删除当前run,然后再自己手动插入一个新的run。
					para.removeRun(i);
					para.insertNewRun(i).setText(runText);
				}
			}
		}
	}
 
	/**
	 * 正则匹配字符串
	 * 
	 * @param str
	 * @return
	 */
	private Matcher matcher(String str) {
		Pattern pattern = Pattern.compile("\\$\\{(.+?)\\}", Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(str);
		return matcher;
	}
}