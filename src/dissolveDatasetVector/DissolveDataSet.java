package dissolveDatasetVector;

import com.supermap.analyst.spatialanalyst.DissolveParameter;
import com.supermap.analyst.spatialanalyst.DissolveType;
import com.supermap.analyst.spatialanalyst.GeneralizeAnalyst;
import com.supermap.data.DatasetType;
import com.supermap.data.DatasetVector;
import com.supermap.data.Datasource;
import com.supermap.data.EngineType;
import com.supermap.data.Workspace;
import com.supermap.data.WorkspaceConnectionInfo;
import com.supermap.ui.MapControl;


public class DissolveDataSet {
	public static void main(String[]args){
		
		Workspace workspace = new Workspace();
		MapControl mapControl = new MapControl();
//		
		WorkspaceConnectionInfo workspaceConnectionInfo = new WorkspaceConnectionInfo();
		Datasource datasource = new Datasource(EngineType.UDB);
//		workspaceConnectionInfo.setType(WorkspaceType.SMWU);
////			String file = "C:/Users/Administrator/Desktop/map2.2/FXDT.smwu";
		String  file = "F:/A_supermap/superMap_file/Dissovle/dissolveDatasetVector/data/dissovle.smwu";
//		
//		String  fileMif = "F:/A_supermap/superMap_file/Dissovle/dissolveDatasetVector/data/Dbeijing.mif";
//		
////			String file = filePath.getString("filePath");
		workspaceConnectionInfo.setServer(file);
		workspace.open(workspaceConnectionInfo);			
//			datasource = workspace.getDatasources().get("areakind"); 		
		mapControl.getMap().setWorkspace(workspace);
		datasource = workspace.getDatasources().get(0);
////		
//		ImportSettingMIF importSettingMIF=  new ImportSettingMIF(fileMif,datasource);	
//		DataImport dataImport =new DataImport();
//		dataImport.getImportSettings().add(importSettingMIF);
//		dataImport.run();
		
		if (datasource == null) {
            System.out.println("打开数据源失败");
	    } else {
	        System.out.println("数据源打开成功！");
	    }
//		// ThiessenPolygon
		DatasetVector dtv=(DatasetVector) datasource.getDatasets().get("ThiessenPolygon");
		
		DatasetType dataSetType = datasource.getDatasets().get("ThiessenPolygon").getType();
//		
		String dtvNewName=datasource.getDatasets().getAvailableDatasetName("New1_"+dtv.getName());
		String[] fieldNames=new String[]{"bsc"};
		
		DissolveParameter dissolveParameter=new DissolveParameter();
		 //设置融合类型     (MULTIPART :融合后组合, ONLYMULTIPART : 组合,SINGLE: 融合)
		dissolveParameter.setDissolveType(DissolveType.MULTIPART);
//		dissolveParameter.setDissolveType(DissolveType.ONLYMULTIPART);
//		dissolveParameter.setDissolveType(DissolveType.SINGLE);
		// 设置融合字段的名称的集合
		dissolveParameter.setFieldNames(fieldNames);
//		// 融合容限
		dissolveParameter.setTolerance(0.0000008338);	
//		// 矢量数据融合
		DatasetVector datasetVector=GeneralizeAnalyst.dissolve(dtv, datasource, dtvNewName, 
				dissolveParameter);
		if (datasetVector==null) {
			System.out.println("矢量数据集为空");
			return;
		}
//		
		mapControl.getMap().getLayers().add(datasetVector, true);
		mapControl.getMap().refresh();
		
		dtv.close();
		datasetVector.close();			
		datasource.close();
		workspaceConnectionInfo.dispose();
	    workspace.dispose();
		
	    // 直接通过.udb 文件来 打开数据源
//	    String  fileUdb = "F:/A_supermap/superMap_file/Dissovle/dissolveDatasetVector/data/eq.udb";
//		DatasourceConnectionInfo Info = new DatasourceConnectionInfo(
//				fileUdb,"eq" ,"");
//		mapControl.getMap().setWorkspace(workspace);
//		Datasource Ds = workspace.getDatasources().open(Info);
//		if (Ds != null) {
//			System.out.println("打开数据源成功");
//			System.out.println(Ds.getDatasets().get(0).getName());
//		} else {
//			System.out.println("打开数据源失败");
//		}
//		Ds.close();
//		workspace.dispose();
		
	}
}
