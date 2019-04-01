package com.sqlQuery;

import java.util.HashMap;
import java.util.Map;

import com.supermap.data.DatasetVector;
import com.supermap.data.Datasource;
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
 * @author  作者 E-mail: 
 * @date 创建时间：2019年1月3日 下午3:19:58
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class JavaObject {
	public static void main(String[]args){
		Map<String, String> map = new HashMap<String, String>();
		JavaObject jObject=new JavaObject();
		map = jObject.searchAddress("116","39","");
	}
	// 空间查询点面相交
		public Map<String, String> searchAddress(String lon,String lat,String locaKindFlag){
			Map<String, String> map = new HashMap<String, String>();
//			ResourceBundle filePath = ResourceBundle.getBundle("config.map", Locale.getDefault());
			double lonX = Double.parseDouble(lon);
			double latY = Double.parseDouble(lat);
//			double lonX= 79.724 ,latY = 37.385;
			// 如果是02坐标系转为84坐标系
				
			try {		
				System.out.println("======================begin==================================");		
				Workspace workspace = new Workspace();
				System.out.println("======================after==================================");
				WorkspaceConnectionInfo workspaceConnectionInfo = new WorkspaceConnectionInfo();
				Datasource datasource = new Datasource(EngineType.UDB);
				// 组织成点数据集		
				GeoPoint geoPoint =new GeoPoint(lonX,latY);
				
				workspaceConnectionInfo.setType(WorkspaceType.SMWU);
//				String file = "F:/A_supermap/superMap_file/allmap/map/map/FXDT.smwu";
				String file = "/home/supermapData/map/FXDT.smwu";
//				String file = filePath.getString("filePath");
				workspaceConnectionInfo.setServer(file);
				workspace.open(workspaceConnectionInfo);
				
				datasource = workspace.getDatasources().get("areakind"); 
				
				System.out.println("Alias:"+datasource.getAlias());
				System.out.println("count:"+datasource.getDatasets().getCount());
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
					// 获取市级的名称			
				}else if(datasource.getDatasets().getCount()>0){
					map.put("errorFlag", "0");
					map.put("errorMessage", "此经纬度不在中国范围之内，请重新选择！");
				}else {
					// 其他情况
					map.put("errorFlag", "2");
					map.put("errorMessage", "系统异常");
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
				if(workspaceConnectionInfo!=null){
					workspaceConnectionInfo.dispose();
				}
				if(workspace!=null){
					workspace.dispose();
				}
						
			} catch (Exception e) {
				e.printStackTrace();
				// 其他情况
				map.put("errorFlag", "2");
				map.put("errorMessage", "ObjectJava中缺少依赖,请更新依赖！");
			}		     
			return map;
		}

}
