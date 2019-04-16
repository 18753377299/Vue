package docx;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
 
import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.util.Map;
 
public class XmlTplUtil {
 
    private static XmlTplUtil tplm = null;
    private Configuration cfg = null;
 
    private XmlTplUtil() {
        cfg = new Configuration();
        try {
            // 注册tmlplate的load路径
            // 这的路径是xml的路径
            String pathName = XmlTplUtil.class.getClassLoader().getResource("").getPath();
            String path = pathName.substring(1, pathName.lastIndexOf("/"));
            String parentPath1 = new File(path).getParent();//获取项目的上一级目录
            String parentPath2 = new File(parentPath1).getParent();//获取项目的上一级目录
//            String xmlPath = parentPath2 + "/static/excelModel";
//            String xmlPath = parentPath2 + "/static/excelModel";
            String xmlPath = "F:/eclipse/Vue/src/template/docx";
            cfg.setDirectoryForTemplateLoading(new File(xmlPath));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
 
    private static Template getTemplate(String name) throws IOException {
        if (tplm == null) {
            tplm = new XmlTplUtil();
        }
       Template template =  tplm.cfg.getTemplate(name);
        return template;
    }
 
    /**
     *
     * @param templatefile 模板文件
     * @param param 需要填充的内容
     * @param out 填充完成输出的文件
     * @throws IOException
     * @throws TemplateException
     */
    public static void process(String templatefile, Map param, Writer out) throws IOException, TemplateException {
        // 获取模板
        Template template = XmlTplUtil.getTemplate(templatefile);
        template.setOutputEncoding("GBK");
        // 合并数据
        template.process(param, out);
        if (out != null) {
            out.close();
        }
    }
}