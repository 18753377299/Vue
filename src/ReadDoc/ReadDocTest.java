package ReadDoc;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月15日 下午7:29:49
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class ReadDocTest {
    
    public  static void main(String[]args)  throws Exception {
//    	String soureString="F:/riskcontrol/riskcontrol_file/downloadFile/abc.doc";
    	String soureString="F:/riskcontrol/riskcontrol_file/downloadFile/aaaaa.doc";
        ReadDoc rd = new ReadDoc();
//        rd.testReadByDoc("D:\\template.doc");
        rd.testReadByDoc(soureString);
        
        
    }
}
