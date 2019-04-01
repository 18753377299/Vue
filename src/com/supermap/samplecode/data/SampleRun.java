package com.supermap.samplecode.data;

import java.awt.Color;
import java.util.Map;

import com.supermap.data.DatasetVector;
import com.supermap.data.Datasource;
import com.supermap.data.DatasourceConnectionInfo;
import com.supermap.data.EngineType;
import com.supermap.data.Feature;
import com.supermap.data.FieldInfo;
import com.supermap.data.FieldInfos;
import com.supermap.data.QueryParameter;
import com.supermap.data.Recordset;
import com.supermap.data.SpatialQueryMode;
import com.supermap.data.StatisticMode;
import com.supermap.data.Workspace;
import com.supermap.data.WorkspaceConnectionInfo;
import com.supermap.data.WorkspaceType;
import com.supermap.data.conversion.DataImport;
import com.supermap.data.conversion.ImportSetting;
import com.supermap.data.conversion.ImportSettingMIF;
import com.supermap.data.conversion.ImportSettings;
import com.supermap.mapping.Layer;
import com.supermap.mapping.Layers;
import com.supermap.mapping.Selection;
import com.supermap.ui.MapControl;

/**
 * <p>
 * Title:空间查询
 * </p>
 * 
 * <p>
 * Description:
 * ============================================================================>
 * ------------------------------版权声明----------------------------
 * 此文件为SuperMap Objects Java 的示范代码 
 * 版权所有：北京超图软件股份有限公司
 * ----------------------------------------------------------------
 * ---------------------SuperMap iObjects Java 示范程序说明------------------------
 * 
 * 1、范例简介：示范如何对数据进行空间查询，并在MapControl中展示出来
 * 2、示例数据：安装目录\SampleData\World\World.smwu
 * 3、关键类型/成员: 
 *      QueryParameter.setSpatialQueryObject 方法
 *      QueryParameter.setSpatialQueryMode 方法
 *      SpatialQueryMode.CONTAIN 常量
 *      SpatialQueryMode.INTERSECT 常量
 *      SpatialQueryMode.DISJOINT 常量
 *      Map.findSelection 方法
 *      Selecttion.toRecordset 方法
 *      Selecttion.fromRecordset 方法
 *      DatasetVector.query 方法
 * 4、使用步骤：
 *   (1)在地图上选择对象作为查询对象
 *   (2)点击相应的按钮进行相关的查询，查询结果在地图中以选择集的方式展现出来
 * ------------------------------------------------------------------------------
 * ============================================================================>
 * </p> 
 * 
 * <p>
 * Company: 北京超图软件股份有限公司
 * </p>
 * 
 */

public class SampleRun {

	private Workspace m_workspace;

	private MapControl m_mapControl;

	//查询用到的数据
	private static String m_mapName = "世界地图";
	private static String m_queryObjectLayerName = "Ocean@world";
    
	private static String m_queriedLayerName = "单值专题图";
	/**
	 * 根据workspace和mapControl构造 SampleRun对象
	 */
	public SampleRun(MapControl mapControl, Workspace workspace) {
		m_workspace = workspace;
		m_mapControl = mapControl;

		m_mapControl.getMap().setWorkspace(workspace);
		initialize();
	}

	/**
	 * 打开需要的数据源及地图
	 */
	private void initialize() {
		try {
			//打开工作空间及地图
//			WorkspaceConnectionInfo conInfo = new WorkspaceConnectionInfo(
//					"../../SampleData/World/World.smwu");
			WorkspaceConnectionInfo conInfo = new WorkspaceConnectionInfo(
					"F:/A_supermap/superMap_file/SMO_Java_811_14428_59859_Win_vc11_CHS_Zip/SampleData/World/World.smwu");
			conInfo.setType(WorkspaceType.SMWU);
			m_workspace.open(conInfo);
			this.m_mapControl.getMap().open(m_mapName);
			
//			Geometry geometry=  new Geometry();
			
			//调整图层状态

			for (int i = 0; i < m_mapControl.getMap().getLayers().getCount(); i++) {
				Layer layer = m_mapControl.getMap().getLayers().get(i);
				if (!layer.getName().equals(m_queryObjectLayerName)) {
					layer.setSelectable(false);
				} else {
					// 设置图层中对象是否可以选择
					layer.setSelectable(true);
				}
			}

			Layer layer1 = m_mapControl.getMap().getLayers().get(
					m_queriedLayerName);
			// getSelection()设置此图层中的选择集对象
			layer1.getSelection().getStyle().setLineColor(Color.YELLOW);

		} catch (Exception ex) {
			System.out.println(ex.getMessage());
		}
	}

	/**
	 * 按照各种算子进行查询
	 */
	public void query(SpatialQueryMode mode) {
		try {
			//获取地图中的选择集，并转换为记录集
			Selection[] selections = m_mapControl.getMap().findSelection(true);
			Selection selection = selections[0];
			Recordset recordset = selection.toRecordset();

			//设置查询参数
			QueryParameter parameter = new QueryParameter();
			parameter.setSpatialQueryObject(recordset);
			parameter.setSpatialQueryMode(mode);
			parameter.setAttributeFilter("POINTX_2000 >125");
//			parameter.setOrderBy(new String[] {"SMID asc","POINTY_2000 desc"});
			
			 Workspace workspace = new Workspace();
		     // 定义数据源连接信息，假设以下所有数据源设置都存在
	         DatasourceConnectionInfo datasourceconnection = new DatasourceConnectionInfo();
			 datasourceconnection.setEngineType(EngineType.ORACLEPLUS);
	         datasourceconnection.setServer("10.10.68.248:1521/orcl");
	         datasourceconnection.setDatabase("riskcontrol");
	         datasourceconnection.setUser("riskcontrol");
	         datasourceconnection.setPassword("riskcontrol");
	         datasourceconnection.setAlias("ORACLE");
	         
	         // 打开数据源
	         Datasource datasource = workspace.getDatasources().open(datasourceconnection);
	         
	        String  fileMif = "F:/A_supermap/superMap_file/Dissovle/dissolveDatasetVector/data/Dbeijing.mif";
	 		
	         
	        ImportSettingMIF importSettingMIF=  new ImportSettingMIF(fileMif,datasource);		
	 		ImportSetting importSetting=  (ImportSetting)importSettingMIF;
//	 		ImportSettings importSettings =ImportSettings.add(importSetting);
//	 		ImportSettings importSettings= new ImportSettings();
	 		ImportSettings importSettings=ImportSettings.class.newInstance();
	 		importSettings.add(importSetting);
	 		int i= importSettings.add(importSetting);
	 		DataImport dataImport =new DataImport();
	 		dataImport.getImportSettings().add(importSettingMIF);

	 		dataImport.setImportSettings(importSettings);
	         
	         // 获取的点数据集
	         DatasetVector dataset = (DatasetVector)datasource.getDatasets().get("RISKMAP_ADDRESS");
	         
	         DatasetVector dataset2 = (DatasetVector)datasource.getDatasets().get("RISKMAP_DISASTER2");
	         
	         
	         if (datasource == null) {
	                 System.out.println("打开数据源失败");
	         } else {
	                 System.out.println("数据源打开成功！");
	         }
	       //---------------------------------------------
	        double average = dataset.statistic("POINTX_2000",StatisticMode.AVERAGE);
			System.out.println("POINTX_2000的平均值为：" + average);
	        average = 131;
			QueryParameter queryParameter = new QueryParameter();
			queryParameter.setAttributeFilter("POINTX_2000 >"+average);
			queryParameter.setHasGeometry(true);
			
			Recordset queryRecordset = dataset.query(queryParameter);
			FieldInfos  fieldInfos = queryRecordset.getFieldInfos();
			FieldInfo  fieldInfo = fieldInfos.get(0);
			String  name = fieldInfo.getName();
			String  value = fieldInfo.getDefaultValue();
//			System.out.println(name+":"+value);
//			
//			Map<Integer,Feature>  features= queryRecordset.getAllFeatures();
//			for(Feature feature:features.values()){
//				String valueString = feature.getString("POINTX_2000");
//				System.out.println("POINTX_2000:"+valueString);
//			}
			//---------------------------------------------
	         
			//对指定查询的图层进行查询
			Layer layer = m_mapControl.getMap().getLayers().get(
					m_queriedLayerName);
			Layers layers =  m_mapControl.getMap().getLayers();
			for(int k=0;k<layers.getCount() ;k++){
				System.out.println(layers.get(k).getName());
			}
			
//			DatasetVector dataset = (DatasetVector) layer.getDataset();
			Recordset recordset2 = dataset.query(parameter);
			System.out.println(recordset2.getRecordCount());
			Map<Integer,Feature>  featuresContain= recordset2.getAllFeatures();
			for(Feature feature:featuresContain.values()){
				String SMID = feature.getString("SMID");
				String valueString = feature.getString("POINTX_2000");
				System.out.println(SMID+":POINTX_2000_contain:"+valueString);
			}
			
//			dataset2.append(recordset2);
//			layer.getSelection().fromRecordset(recordset2);
			recordset2.dispose();

			//刷新地图
			m_mapControl.getMap().refresh();
			recordset.dispose();
		} catch (Exception ex) {
			System.out.println(ex.getMessage());
		}
	}

}

