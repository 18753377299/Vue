package dissolveDatasetVector;

import com.supermap.data.CursorType;
import com.supermap.data.DatasetType;
import com.supermap.data.DatasetVector;
import com.supermap.data.DatasetVectorInfo;
import com.supermap.data.Datasets;
import com.supermap.data.Datasource;
import com.supermap.data.EncodeType;
import com.supermap.data.EngineType;
import com.supermap.data.Recordset;
import com.supermap.data.Workspace;
import com.supermap.data.WorkspaceConnectionInfo;
import com.supermap.data.WorkspaceType;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月2日 下午5:14:19
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class DissolveMoreDataSet {
	public static void main(String [] args){
		
		Workspace workspace = new Workspace();
		WorkspaceConnectionInfo workspaceConnectionInfo = new WorkspaceConnectionInfo();
		Datasource datasource = new Datasource(EngineType.UDB);
		workspaceConnectionInfo.setType(WorkspaceType.SMWU);
		
		String  file = "F:/A_supermap/superMap_file/Dissovle/dissolveDatasetVector/data/dissovle.smwu";
//		String file =filePath.getString("filePath");
		workspaceConnectionInfo.setServer(file);
		workspace.open(workspaceConnectionInfo); 
		
		datasource = workspace.getDatasources().get("dissovle"); 
		
		if (datasource == null) {
            System.out.println("打开数据源失败");
	    } else {
	        System.out.println("数据源打开成功！");
	    }
		Datasets datasets = datasource.getDatasets();
		 String name = datasets.getAvailableDatasetName("河流");
		// 设置矢量数据集的信息
       DatasetVectorInfo datasetVectorInfo = new DatasetVectorInfo();
       datasetVectorInfo.setName("lqk111111");
       datasetVectorInfo.setType(DatasetType.REGION );
       datasetVectorInfo.setEncodeType(EncodeType.NONE);
       datasetVectorInfo.setFileCache(true);
       
       System.out.println("矢量数据集的信息为：" + datasetVectorInfo.toString());

       // 创建矢量数据集
       DatasetVector datasetVector = datasets.create(datasetVectorInfo);
       Recordset recordset = datasetVector.getRecordset(false, CursorType.DYNAMIC);
       recordset.close();
//     geometry.dispose();
     recordset.dispose();
     datasetVector.close();
     if(datasource!=null){
			datasource.close();
		}
	    if(workspaceConnectionInfo!=null){
	    	workspaceConnectionInfo.dispose();
		}
		if(workspace!=null){
			// 关闭工作空间
			workspace.close();
			// 释放该对象所占用的资源
			workspace.dispose();
		}
		
		
		
		
		
	}
}
