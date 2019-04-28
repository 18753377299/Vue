package jdbc;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月28日 下午2:02:01
 * @version 1.0 
 * @parameter 
 * @since  把oracle中地图数据插入到另一个oracle数据库中
 * @return  */

public class OracleToOracle {
	public static void main(String [] args){
		Connection connect = null;
//        Statement statement = null;
        PreparedStatement preState = null;
        ResultSet resultSet = null;
		try {
           //第一步：注册驱动
           //第一种方式：类加载(常用)
//           Class.forName("oracle.jdbc.OracleDriver");
			 Class.forName("oracle.jdbc.driver.OracleDriver");
           

           //第二种方式：利用Driver对象
//           Driver driver = new OracleDriver();
//           DriverManager.deregisterDriver(driver);
           
           //第二步：获取连接
           //第一种方式：利用DriverManager（常用）
           connect = DriverManager.getConnection("jdbc:oracle:thin:@10.10.68.248:1521:orcl", "riskcontrol_freeze", "riskcontrol_freeze");

           //第二种方式：直接使用Driver
//           Properties pro = new Properties();
//           pro.put("user", "你的oracle数据库用户名");
//           pro.put("password", "用户名密码");
//           connect = driver.connect("jdbc:oracle:thin:@localhost:1521:XE", pro);

           //测试connect正确与否
           System.out.println(connect);  


           //第三步：获取执行sql语句对象
           //第一种方式:statement
//           statement = connect.createStatement();

           //第二种方式：PreStatement
           String sql = "select * from SMDTV_45 where SMID=4";
//           PreparedStatement preState = connect.prepareStatement("select  * from tb1_dept where id = ?");
           preState = connect.prepareStatement(sql);


           //第四步：执行sql语句
           //第一种方式：SMDTV_33
//           resultSet = statement.executeQuery("select  * from RISKINFO_CLAIM where SERIALNO ='26'");
//           resultSet = statement.executeQuery("select * from SMDTV_45 where SMID=3");
           	
           //第二种方式：
//           preState.setInt(1, 2);//1是指sql语句中第一个？,  2是指第一个？的values值
           resultSet = preState.executeQuery();        //执行查询语句
           //查询任何语句，如果有结果集，返回true，没有的话返回false,注意如果是插入一条数据的话，虽然是没有结果集，返回false，但是却能成功的插入一条数据
//           boolean execute = preState.execute();
//           System.out.println(execute);

           //第五步：处理结果集
           while (resultSet.next()){
//        	   byte[] SMGEOMETRY = null;
               Integer  SMID = resultSet.getInt("SMID");
               Integer SMKEY = resultSet.getInt("SMKEY");
               BigDecimal SMSDRIW = new BigDecimal(resultSet.getString("SMSDRIW"));
               BigDecimal SMSDRIN = new BigDecimal(resultSet.getString("SMSDRIN"));
               BigDecimal SMSDRIE = new BigDecimal(resultSet.getString("SMSDRIE"));
               BigDecimal SMSDRIS = new BigDecimal(resultSet.getString("SMSDRIS"));
               BigDecimal SMGRANULE = new BigDecimal(resultSet.getString("SMGRANULE"));
               byte[] SMGEOMETRY =resultSet.getBytes("SMGEOMETRY");
               Integer  SMUSERID = resultSet.getInt("SMUSERID");
               Integer  SMLIBTILEID = resultSet.getInt("SMLIBTILEID");
               BigDecimal SMAREA = new BigDecimal(resultSet.getString("SMAREA"));
               BigDecimal SMPERIMETER = new BigDecimal(resultSet.getString("SMPERIMETER"));
               Integer  FIELD_SMUSERID = resultSet.getInt("FIELD_SMUSERID");
               String  ADMINCODE = resultSet.getString("ADMINCODE");
               String  KIND = resultSet.getString("KIND");
               String  NAME = resultSet.getString("NAME");
               String  PY = resultSet.getString("PY");
               String  CITYADCODE = resultSet.getString("CITYADCODE");
               String  PROADCODE = resultSet.getString("PROADCODE");
               BigDecimal CENTERX = new BigDecimal(resultSet.getString("CENTERX"));
               BigDecimal CENTERY = new BigDecimal(resultSet.getString("CENTERY"));
               BigDecimal LEVELFLAG = new BigDecimal(resultSet.getString("LEVELFLAG"));
               String  PROVINCENAME = resultSet.getString("PROVINCENAME");
               String  CITYNAME = resultSet.getString("CITYNAME");
               
               System.out.println(SMID+"   "+SMKEY+"   "+SMSDRIW);  //打印输出结果集
               OracleToOracle.insertData(SMID,SMKEY,SMSDRIW,SMSDRIN,SMSDRIE,SMSDRIS,SMGRANULE,SMGEOMETRY,
            		   SMUSERID,SMLIBTILEID,SMAREA,SMPERIMETER,FIELD_SMUSERID,ADMINCODE,KIND,NAME,PY,CITYADCODE,
            		   PROADCODE,CENTERX,CENTERY,LEVELFLAG,PROVINCENAME,CITYNAME);
           }
       } catch (Exception e) {
           e.printStackTrace();
       }finally {
           //第六步：关闭资源
               try {
                   if (resultSet!=null) resultSet.close();
                   // 第一种
//                   if (statement!=null) statement.close();
//                   第二种
                   if (preState!=null) preState.close();
                   if (connect!=null) connect.close();
               } catch (SQLException e) {
                   e.printStackTrace();
               }
       }
	}
//	public static void insertData (Integer SMID,Integer SMKEY,BigDecimal SMSDRIW ,byte[] SMGEOMETRY){
	public static void 	insertData(Integer SMID,Integer SMKEY,BigDecimal SMSDRIW,BigDecimal SMSDRIN,BigDecimal SMSDRIE,
			BigDecimal SMSDRIS,BigDecimal SMGRANULE,byte[] SMGEOMETRY,Integer  SMUSERID,Integer  SMLIBTILEID,
			BigDecimal SMAREA,BigDecimal SMPERIMETER,Integer FIELD_SMUSERID,String ADMINCODE,String KIND,String NAME,
			String PY,String CITYADCODE,String PROADCODE,BigDecimal CENTERX,BigDecimal CENTERY,
			BigDecimal LEVELFLAG,String PROVINCENAME,String CITYNAME){	
		Connection connect = null;
//      Statement statement = null;
		PreparedStatement preState = null;
		ResultSet resultSet = null;
		 try {
			 Class.forName("oracle.jdbc.driver.OracleDriver");
			connect = DriverManager.getConnection("jdbc:oracle:thin:@10.10.68.248:1521:orcl", "riskcontrol", "riskcontrol");
			
			String sql = "insert into MYAREA(SMID,SMKEY,SMSDRIW,SMSDRIN,SMSDRIE,SMSDRIS,SMGRANULE,SMGEOMETRY,SMUSERID,SMLIBTILEID,SMAREA,SMPERIMETER,FIELD_SMUSERID,ADMINCODE,KIND,NAME,PY,CITYADCODE,PROADCODE,CENTERX,CENTERY,LEVELFLAG,PROVINCENAME,CITYNAME)"
					+ " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//           PreparedStatement preState = connect.prepareStatement("select  * from tb1_dept where id = ?");
           preState = connect.prepareStatement(sql);
           //插入的时候索引是从1 开始的，不是从0开始的
           preState.setInt(1, SMID);
           preState.setInt(2, SMKEY);
           preState.setBigDecimal(3, SMSDRIW);
           preState.setBigDecimal(4, SMSDRIN);
           preState.setBigDecimal(5, SMSDRIE);
           preState.setBigDecimal(6, SMSDRIS);
           preState.setBigDecimal(7, SMGRANULE);
           preState.setBytes(8, SMGEOMETRY);
           preState.setInt(9, SMUSERID);
           preState.setInt(10, SMLIBTILEID);
           preState.setBigDecimal(11, SMAREA);
           preState.setBigDecimal(12, SMPERIMETER);
           preState.setInt(13, FIELD_SMUSERID);
           preState.setString(14, ADMINCODE);
           preState.setString(15, KIND);
           preState.setString(16, NAME);
           preState.setString(17, PY);
           preState.setString(18, CITYADCODE);
           preState.setString(19, PROADCODE);
           preState.setBigDecimal(20, CENTERX);
           preState.setBigDecimal(21, CENTERY);
           preState.setBigDecimal(22, LEVELFLAG);
           preState.setString(23, PROVINCENAME);
           preState.setString(24, CITYNAME);
           
           preState.executeUpdate();
		   System.out.println("========插入成功============");
		}catch (Exception e) {
	           e.printStackTrace();
        }finally {
           //第六步：关闭资源
               try {
                   if (resultSet!=null) resultSet.close();
                   // 第一种
//	                   if (statement!=null) statement.close();
//	                   第二种
                   if (preState!=null) preState.close();
                   if (connect!=null) connect.close();
               } catch (SQLException e) {
                   e.printStackTrace();
               }
       }

	}
	
}
