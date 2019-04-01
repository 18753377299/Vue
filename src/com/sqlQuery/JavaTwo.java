package com.sqlQuery;

import java.util.HashMap;
import java.util.Map;

import com.supermap.data.DatasetVector;
import com.supermap.data.Datasource;
import com.supermap.data.DatasourceConnectionInfo;
import com.supermap.data.EngineType;
import com.supermap.data.Feature;
import com.supermap.data.GeoPoint;
import com.supermap.data.QueryParameter;
import com.supermap.data.Recordset;
import com.supermap.data.SpatialQueryMode;
import com.supermap.data.Workspace;
import com.supermap.data.WorkspaceConnectionInfo;
import com.supermap.data.WorkspaceType;
	/**
 * @author  浣滆�� E-mail: 
 * @date 鍒涘缓鏃堕棿锛�2019骞�1鏈�3鏃� 涓嬪崍3:54:13
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class JavaTwo {
	public static void main(String[]args){
		Map<String, String> map = new HashMap<String, String>();
		JavaTwo jObject=new JavaTwo();
		map = jObject.searchAddress("116","39","");
	}
	// 绌洪棿鏌ヨ鐐归潰鐩镐氦
		public Map<String, String> searchAddress(String lon,String lat,String locaKindFlag){
			Map<String, String> map = new HashMap<String, String>();
//			ResourceBundle filePath = ResourceBundle.getBundle("config.map", Locale.getDefault());
			double lonX = Double.parseDouble(lon);
			double latY = Double.parseDouble(lat);
//			double lonX= 79.724 ,latY = 37.385;
			// 濡傛灉鏄�02鍧愭爣绯昏浆涓�84鍧愭爣绯�
				
			try {		
				System.out.println("======================begin==================================");		
				Workspace workspace = new Workspace();
				System.out.println("======================after==================================");
//				WorkspaceConnectionInfo workspaceConnectionInfo = new WorkspaceConnectionInfo();
//				Datasource datasource = new Datasource(EngineType.UDB);
//				// 缁勭粐鎴愮偣鏁版嵁闆�		
				GeoPoint geoPoint =new GeoPoint(lonX,latY);
//				
//				workspaceConnectionInfo.setType(WorkspaceType.SMWU);
////				String file = "F:/A_supermap/superMap_file/allmap/map/map/FXDT.smwu";
//				String file = "/home/supermapData/map/FXDT.smwu";
////				String file = filePath.getString("filePath");
//				workspaceConnectionInfo.setServer(file);
//				workspace.open(workspaceConnectionInfo);
				
				 // 瀹氫箟鏁版嵁婧愯繛鎺ヤ俊鎭紝鍋囪浠ヤ笅鎵�鏈夋暟鎹簮璁剧疆閮藉瓨鍦�
		        DatasourceConnectionInfo datasourceconnection = new  DatasourceConnectionInfo();
				datasourceconnection.setEngineType(EngineType.ORACLEPLUS);
//		        datasourceconnection.setServer("10.10.68.248:1521/orcl");
		        datasourceconnection.setServer("10.133.198.50:1521/fcfk ");
//				datasourceconnection.setServer("ORCL");
//		        datasourceconnection.setDatabase("riskcontrol");
//		        datasourceconnection.setUser("riskcontrol"); // riskcontrol_freeze
//		        datasourceconnection.setPassword("riskcontrol");
		        
		        datasourceconnection.setDatabase("fcfkdb");
		        datasourceconnection.setUser("fcfkdb"); // riskcontrol_freeze
		        datasourceconnection.setPassword("fcfkdb_1009");
		        datasourceconnection.setAlias("ORACLE");
		     // 鎵撳紑鏁版嵁婧�
		        Datasource datasource = workspace.getDatasources().open(datasourceconnection);
				
				
//				datasource = workspace.getDatasources().get("areakind"); 
				
				System.out.println("Alias:"+datasource.getAlias());
				System.out.println("count:"+datasource.getDatasets().getCount());
				for(int i=0;i<datasource.getDatasets().getCount();i++){
					System.out.println(datasource.getDatasets().get(i).getName());
				}
//				System.out.println("name:"+datasource.getDatasets().get(0).getName()); 
				DatasetVector   datasetVectorCountry = (DatasetVector) datasource.getDatasets().get("china_county");            
				
				QueryParameter parameter = new QueryParameter();
				parameter.setSpatialQueryObject(geoPoint);
				parameter.setSpatialQueryMode(SpatialQueryMode.INTERSECT);
				
				Recordset queryRecordset = datasetVectorCountry.query(parameter);
				
				Map<Integer,Feature>  features= queryRecordset.getAllFeatures();
				System.out.println(queryRecordset.getRecordCount());
				String adminCode="",countryName="",cityAdCode="",proAdCode="";
				String cityName= "",provinceName= "";
				if(datasource.getDatasets().getCount()>0&&queryRecordset.getRecordCount()>0){
					for(Feature feature:features.values()){
						 countryName = feature.getString("Name");
						 adminCode = feature.getString("AdminCode");
						 cityAdCode = feature.getString("CityAdCode");
						 proAdCode = feature.getString("ProAdCode");
						 cityName =feature.getString("cityName");
						 provinceName =feature.getString("provinceName");
						System.out.println("countryName:"+countryName+":"+proAdCode+":"+cityName+":"+provinceName+":"+adminCode+":"+cityAdCode);
					}
					// 鑾峰彇甯傜骇鐨勫悕绉�			
				}else if(datasource.getDatasets().getCount()>0){
					map.put("errorFlag", "0");
					map.put("errorMessage", "姝ょ粡绾害涓嶅湪涓浗鑼冨洿涔嬪唴锛岃閲嶆柊閫夋嫨锛�");
				}else {
					// 鍏朵粬鎯呭喌
					map.put("errorFlag", "2");
					map.put("errorMessage", "绯荤粺寮傚父");
				}
				map.put("proAdCode",proAdCode);
				map.put("provinceName",provinceName);
				map.put("cityAdCode",cityAdCode);
				map.put("cityName",cityName);
				map.put("adminCode",adminCode);
				map.put("countryName",countryName);
				
				if(parameter!=null){
					parameter.dispose();
				}
				
				if(queryRecordset!=null){
					queryRecordset.dispose();
				}
				if(datasetVectorCountry!=null){
					datasetVectorCountry.close();
				}
				if(geoPoint!=null){
					geoPoint.dispose();
				}
			    if(datasource!=null){
					datasource.close();
				}
//				if(workspaceConnectionInfo!=null){
//					workspaceConnectionInfo.dispose();
//				}
			    if(datasourceconnection!=null){
					datasourceconnection.dispose();
				}
				if(workspace!=null){
					workspace.dispose();
				}
						
			} catch (Exception e) {
				e.printStackTrace();
				// 鍏朵粬鎯呭喌
				map.put("errorFlag", "2");
				map.put("errorMessage", "ObjectJava涓己灏戜緷璧�,璇锋洿鏂颁緷璧栵紒");
			}		     
			return map;
		}
}
