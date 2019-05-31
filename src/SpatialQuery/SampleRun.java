package SpatialQuery;

import java.awt.Color;

import com.supermap.data.DatasetVector;
import com.supermap.data.QueryParameter;
import com.supermap.data.Recordset;
import com.supermap.data.SpatialQueryMode;
import com.supermap.data.Workspace;
import com.supermap.data.WorkspaceConnectionInfo;
import com.supermap.data.WorkspaceType;
import com.supermap.mapping.Layer;
import com.supermap.mapping.Selection;
import com.supermap.mapping.StyleOptions;
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
					"G:/map/超图软件安装工具/supermap-iobjectsjava-9.0.0-15320-63946-linux64-tar.gz-chs/SampleData/World/World.smwu");
			conInfo.setType(WorkspaceType.SMWU);
			m_workspace.open(conInfo);
			this.m_mapControl.getMap().open(m_mapName);

			//调整图层状态

			for (int i = 0; i < m_mapControl.getMap().getLayers().getCount(); i++) {
				Layer layer = m_mapControl.getMap().getLayers().get(i);
				if (!layer.getName().equals(m_queryObjectLayerName)) {
					layer.setSelectable(false);
				} else {
					layer.setSelectable(true);
				}
			}
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

			//对指定查询的图层进行查询
			Layer layer = m_mapControl.getMap().getLayers().get(
					m_queriedLayerName);
			DatasetVector dataset = (DatasetVector) layer.getDataset();
			Recordset recordset2 = dataset.query(parameter);
			layer.getSelection().fromRecordset(recordset2);
			
			layer.getSelection().getStyle().setLineColor(Color.RED);
			layer.getSelection().getStyle().setLineWidth(0.6);
			layer.getSelection().getStyle().setFillSymbolID(1);
			layer.getSelection().setStyleOptions(StyleOptions.FILLSYMBOLID, true);
			layer.getSelection().setDefaultStyleEnabled(false);
			
			recordset2.dispose();

			//刷新地图
			m_mapControl.getMap().refresh();
			recordset.dispose();
		} catch (Exception ex) {
			System.out.println(ex.getMessage());
		}
	}

}

