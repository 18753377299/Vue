package com.sqlQuery;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import com.supermap.data.CursorType;
import com.supermap.data.Dataset;
import com.supermap.data.DatasetVector;
import com.supermap.data.Datasets;
import com.supermap.data.Datasource;
import com.supermap.data.DatasourceConnectionInfo;
import com.supermap.data.Datasources;
import com.supermap.data.EncodeType;
import com.supermap.data.FieldInfos;
import com.supermap.data.QueryParameter;
import com.supermap.data.Recordset;
import com.supermap.data.Workspace;

/**
 * <p>
 * Title:属性查询
 * </p>
 * 
 * <p>
 * Description:
 * ============================================================================>
 * ------------------------------版权声明-------------------------- -- 此文件为SuperMap
 * Objects Java 的示范代码 版权所有：北京超图软件股份有限公司
 * ----------------------------------------------------------------
 * ---------------------SuperMap iObjects Java 示范程序说明------------------------
 * 
 * 1、范例简介：记录集遍历及如何对数据进行属性查询。
 * 2、示例数据：安装目录\SampleData\World\World.udb
 * 3、关键类型/成员: 
 * 		DatasetVector.query 方法 
 * 		QueryParameter.setAttributeFilter 方法
 * 		QueryParameter.setResultFields 方法 
 * 		QueryParameter.setOrderBy 方法
 * 		QueryParameter.setCursorType 方法 
 * 		QueryParameter.setHasGeometry 方法 
 * 4、使用步骤：
 * 		(1)输入数字 1 输出数据集全部记录
 *      (2)输入数字 2 输出SmID>25的查询的结果
 *      (3)输入 q 退出程序
 * ------------------------------------
 * ------------------------------------------
 * ============================================================================>
 * </p>
 * 
 * <p>
 * Company: 北京超图软件股份有限公司
 * </p>
 * 
 */
public class SampleRun {

	public static void main(String[] args) {

		// 打开工作空间，得到数据源
		Workspace workspace = new Workspace();
		Datasources datasources = workspace.getDatasources();
//		DatasourceConnectionInfo datasourceConnectionInfo = new DatasourceConnectionInfo(
//				"../../SampleData/World/World.udb", "sqlquery", "");
		DatasourceConnectionInfo datasourceConnectionInfo = new DatasourceConnectionInfo(
				"F:/A_supermap/superMap_file/SMO_Java_811_14428_59859_Win_vc11_CHS_Zip/SampleData/World/World.udb", "sqlquery", "");
		Datasource datasource = datasources.open(datasourceConnectionInfo);

		// 得到数据集集合类，得到面数据集，通过数据源复制数据集
		Datasets datasets = datasource.getDatasets();
		String datasetVectorName = "del_sqlquery";
		if (datasets.contains(datasetVectorName))
			datasets.delete(datasetVectorName);
		Dataset dataset = datasets.get("Lakes");
		DatasetVector datasetVector = (DatasetVector) datasource.copyDataset(
				dataset, datasetVectorName, EncodeType.NONE);

		BufferedReader bufferedReader = new BufferedReader(
				new InputStreamReader(System.in));
		String hint = "\n输入命令如下：\n数字 1 输出数据集全部记录\n数字 2 输出查询结果\n输入 q 退出\n";
		printWithStar("属性查询示范程序");
		System.out.println(hint);

		String type = "";
		try {
			while (!type.equals("q")) {
				type = bufferedReader.readLine();
				if (type.equals("1")) {
					listAll(datasetVector);
				} else if (type.equals("2")) {
					sqlQuery(datasetVector);
				}
				if (!type.equals("q"))
					System.out.println(hint);
			}
		} catch (Exception ex) {
			System.out.println(ex.getMessage());
		}

		// 释放相关资源
		datasources.closeAll();
		datasourceConnectionInfo.dispose();
		workspace.close();
		workspace.dispose();

		printWithStar("属性查询示范程序退出");
	

	}

	/**
	 * 输出数据集全部记录
	 * 
	 * @param datasetVector 目标数据集
	 */
	private static void listAll(DatasetVector datasetVector) {

		// 获得数据集全部记录
		Recordset recordset = datasetVector.getRecordset(false,
				CursorType.DYNAMIC);

		// 输出记录集记录
		printWithStar("输出数据集全部记录");
		listAll(recordset);
		printWithStar("输出数据集全部记录");
		// 释放记录集
		recordset.dispose();
	}

	/**
	 * 输出查询结果
	 * 
	 * @param datasetVector 目标数据集
	 */
	private static void sqlQuery(DatasetVector datasetVector) {

		// 构造查询参数类，设置查询条件
		QueryParameter queryParameter = new QueryParameter();
		queryParameter.setAttributeFilter("SmID>25");
		queryParameter.setResultFields(new String[] { "SmID", "SmUserID",
				"SmArea", "NAME", "DEPTH" });
		queryParameter.setOrderBy(new String[] { "DEPTH" });
		queryParameter.setCursorType(CursorType.STATIC);
		queryParameter.setHasGeometry(false);

		// 查询得到结果记录集
		Recordset recordset = datasetVector.query(queryParameter);

		// 输出记录集记录
		printWithStar("输出查询结果");
		listAll(recordset);
		printWithStar("输出查询结果");
		// 释放记录集
		recordset.dispose();
	}

	/**
	 * 遍历记录集，输出记录集的记录信息
	 * 
	 * @param recordset 遍历的记录集对象
	 */
	private static void listAll(Recordset recordset) {

		// 输出字段名称
		FieldInfos fieldInfos = recordset.getFieldInfos();
		int count = fieldInfos.getCount();
		for (int i = 0; i < count; i++) {
			String fieldname = fieldInfos.get(i).getName();
			System.out.print(String.format("%-25s", fieldname));
		}
		System.out.println();

		// 输出字段值
		for (recordset.moveFirst(); !recordset.isEOF(); recordset.moveNext()) {
			for (int i = 0; i < count; i++) {
				String value = recordset.getFieldValue(i).toString();
				System.out.print(String.format("%-25s", value));
			}
			System.out.println();
		}
	}

	/**
	 * 以星星的修饰方式输出字符串
	 * 
	 * @param content 原字符串
	 */
	private static void printWithStar(String content) {
		String star = "****************************";
		content = star + content + star;
		System.out.println(content);
	}

}

