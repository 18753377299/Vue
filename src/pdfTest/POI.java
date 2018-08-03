package pdfTest;

import java.awt.Color;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.lowagie.text.BadElementException;
import com.lowagie.text.Cell;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Table;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfWriter;

public class POI {

    public static void main(String[] args) throws DocumentException, IOException {
        // 创建Document对象(页面的大小为A4,左、右、上、下的页边距为10)
        Document document = new Document(PageSize.A4, 10, 10, 500, 10);
        // 建立书写器
        PdfWriter.getInstance(document, new FileOutputStream("D:\\ccc.pdf"));
        // 设置相关的参数
        POI.setParameters(document, "开发者测试", "测试", "测试 开发者 调试", "甘雨路", "甘雨路");
        // 打开文档
        document.open();
        // 使用iTextAsian.jar中的字体
        BaseFont baseFont = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
        Font font = new Font(baseFont);
        
        List<User> users = new ArrayList<User>();
        // 循环添加对象
        for (int i = 0; i < 5; i++) {
            User user = new User();
            user.setId(""+i);
            user.setInfo("开发者测试"+i);
            user.setName("测试"+i);
            users.add(user);
        }
        
        Table table = POI.setTable(users);
        document.add(new Paragraph("用户信息如下：",POI.setFont()));
        document.add(table);
        
        // 关闭文档
        document.close();
    }
    
    public static Table setTable(List<User> users) throws BadElementException{
        //创建一个有3列的表格
        Table table = new Table(3);
        table.setBorderWidth(1);
        table.setBorderColor(new Color(0, 0, 0));
        table.setPadding(5);
        table.setSpacing(5);
        // 创建表头
        Cell cell1 = POI.setTableHeader("编号ID");
        Cell cell2 = POI.setTableHeader("基本信息");
        Cell cell3 = POI.setTableHeader("姓名");
        table.addCell(cell1);
        table.addCell(cell2);
        table.addCell(cell3);
        // 添加此代码后每页都会显示表头
        table.endHeaders();

                
        for (int i = 0; i < users.size(); i++) {
            Cell celli1 = POI.setTableHeader(users.get(i).getId());
            Cell celli2 = POI.setTableHeader(users.get(i).getInfo());
            Cell celli3 = POI.setTableHeader(users.get(i).getName());
            table.addCell(celli1);
            table.addCell(celli2);
            table.addCell(celli3);
        }
        
        return table;
        
    }
    /**
     * 设置字体编码格式
     * @return
     */
    public static Font setFont(){
        BaseFont baseFont = null;
        try {
            baseFont = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
        } catch (DocumentException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        Font font = new Font(baseFont, 8, Font.NORMAL,Color.BLUE);
        return font;
    }
    /**
     * 设置cell
     * @param name
     * @return
     * @throws BadElementException
     */
    public static Cell setTableHeader(String name) throws BadElementException{
        
        Cell cell = new Cell(new Phrase(name,POI.setFont()));
        //单元格水平对齐方式
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        //单元格垂直对齐方式
        cell.setVerticalAlignment(Element.ALIGN_CENTER);
//        cell.setHeader(true);
        cell.setBackgroundColor(Color.RED);
        return cell;
    }
    
    /**
     * 设置相关参数
     * @param document
     * @return
     */
    public static Document setParameters(Document document,String title,String subject,String keywords,String author,
            String creator){
        // 设置标题
        document.addTitle(title);
        // 设置主题
        document.addSubject(subject);
        // 设置作者
        document.addKeywords(keywords);
        // 设置作者
        document.addAuthor(author);
        // 设置创建者
        document.addCreator(creator);
        // 设置生产者
        document.addProducer();
        // 设置创建日期
        document.addCreationDate();
        
        return document;
    }
    
}