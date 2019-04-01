package dissolveDatasetVector;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Menu;
import java.awt.MenuBar;
import java.awt.MenuItem;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JToolBar;
import javax.swing.filechooser.FileNameExtensionFilter;

import com.supermap.analyst.spatialanalyst.DissolveParameter;
import com.supermap.analyst.spatialanalyst.DissolveType;
import com.supermap.analyst.spatialanalyst.GeneralizeAnalyst;
import com.supermap.data.DatasetVector;
import com.supermap.data.Datasource;
import com.supermap.data.DatasourceConnectionInfo;
import com.supermap.data.FillGradientMode;
import com.supermap.data.GeoStyle;
import com.supermap.data.Workspace;
import com.supermap.data.WorkspaceConnectionInfo;
import com.supermap.mapping.Layer;
import com.supermap.mapping.ThemeUnique;
import com.supermap.ui.Action;
import com.supermap.ui.MapControl;

public class  DissolveDatasetVector extends JFrame implements
		ActionListener {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * @param args
	 */
	Workspace workspace = new Workspace();
	MapControl mapCtl = new MapControl();
	MenuBar menubar = new MenuBar();
	JToolBar ToolBar = new JToolBar();
	JFileChooser Dlg = new JFileChooser();
	Layer layer;
	static DissolveDatasetVector frame;

	public DissolveDatasetVector() {
		Init();
	}

	private void Init() {
		this.setExtendedState(JFrame.MAXIMIZED_BOTH);
		this.setTitle("数据集融合");
		this.setSize(900, 700);
		this.addWindowListener(new SMOJ_Sample_this_windowAdapter(this));
		Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
		Dimension frameSize = this.getSize();
		if (frameSize.height > screenSize.height) {
			frameSize.height = screenSize.height;
		}
		if (frameSize.width > screenSize.width) {
			frameSize.width = screenSize.width;
		}
		this.setLocation((screenSize.width - frameSize.width) / 2,
				(screenSize.height - frameSize.height) / 2);

		this.getContentPane().setLayout(null);
		this.getContentPane().setLayout(new BorderLayout());
		this.getContentPane().add(mapCtl, BorderLayout.CENTER);

		BuildMenu();
		BuildToolBar();
	}

	private void BuildMenu() {
		Menu mnuOpen = new Menu();
		Menu mnuHyperlink = new Menu();
		Menu mnuHelp = new Menu();
		MenuItem mnuOpenWksp = new MenuItem();
		MenuItem mnuOpenDs = new MenuItem();
		MenuItem mnuItemHyperlink = new MenuItem();
		MenuItem mnuExit = new MenuItem();
		MenuItem mnuDocument = new MenuItem();

		mnuOpen.setName("打开");
		mnuOpen.setLabel("打开");
		mnuOpenWksp.setName("打开工作空间");
		mnuOpenWksp.setLabel("打开工作空间");
		mnuOpenWksp.addActionListener(this);
		mnuOpenDs.setName("打开数据源");
		mnuOpenDs.setLabel("打开数据源");
		mnuOpenDs.addActionListener(this);
		mnuExit.setName("退出");
		mnuExit.setLabel("退出");
		mnuExit.addActionListener(this);
		mnuOpen.add(mnuOpenWksp);
		mnuOpen.add(mnuOpenDs);

		mnuHyperlink.setName("数据集融合");
		mnuHyperlink.setLabel("数据集融合");
		mnuItemHyperlink.setName("数据集融合");
		mnuItemHyperlink.setLabel("数据集融合");
		mnuItemHyperlink.addActionListener(this);
		mnuHyperlink.add(mnuItemHyperlink);

		mnuHelp.setName("帮助");
		mnuHelp.setLabel("帮助");
		mnuDocument.setName("说明文档");
		mnuDocument.setLabel("说明文档");
		mnuDocument.addActionListener(this);
		mnuHelp.add(mnuDocument);

		menubar.add(mnuOpen);
		menubar.add(mnuHyperlink);
		menubar.add(mnuHelp);
		this.setMenuBar(menubar);
	}

	private void BuildToolBar() {
		ToolBar = new JToolBar();
		ToolBar.setFloatable(true);

		JButton btnSelect = new JButton(new ImageIcon(
				"Resources/action_select.png "));
		btnSelect.setName("选择");
		btnSelect.setToolTipText("选择");
		btnSelect.addActionListener(this);
		ToolBar.add(btnSelect);

		JButton btnZoomIn = new JButton(new ImageIcon(
				"Resources/action_zoomin.png"));
		btnZoomIn.setName("放大");
		btnZoomIn.setToolTipText("放大");
		btnZoomIn.addActionListener(this);
		ToolBar.add(btnZoomIn);

		JButton btnZoomOut = new JButton(new ImageIcon(
				"Resources/action_zoomout.png"));
		btnZoomOut.setName("缩小");
		btnZoomOut.setToolTipText("缩小");
		btnZoomOut.addActionListener(this);
		ToolBar.add(btnZoomOut);

		JButton btnZoomFree = new JButton(new ImageIcon(
				"Resources/action_zoomfree.png"));
		btnZoomFree.setName("自由缩放");
		btnZoomFree.setToolTipText("自由缩放");
		btnZoomFree.addActionListener(this);
		ToolBar.add(btnZoomFree);

		JButton btnPan = new JButton(new ImageIcon("Resources/action_pan.png"));
		btnPan.setName("平移");
		btnPan.setToolTipText("平移");
		btnPan.addActionListener(this);
		ToolBar.add(btnPan);

		JButton btnViewEntire = new JButton(new ImageIcon(
				"Resources/action_viewentire.png"));
		btnViewEntire.setName("全幅显示");
		btnViewEntire.setToolTipText("全幅显示");
		btnViewEntire.addActionListener(this);
		ToolBar.add(btnViewEntire);

		this.getContentPane().add(ToolBar, "North");
	}

	public void Dispose() {
		if (mapCtl != null) {
			mapCtl.getMap().close();
			mapCtl.getMap().refresh();
			mapCtl.dispose();
			mapCtl = null;
		}
		if (workspace != null) {
			workspace.close();
			workspace.dispose();
			workspace = null;
		}
	}

	public void this_windowClosing(WindowEvent e) {
		Dispose();
		System.exit(0);
	}

	public Workspace GetWorkspace() {
		if (workspace == null) {
			workspace = new Workspace();
		}
		return workspace;
	}

	public String PathToName(String strFile) {
		int iStart = strFile.lastIndexOf("\\");
		int iEnd = strFile.lastIndexOf(".");
		if (iStart == -1 || iEnd == -1) {
			System.out.println("pathToName!————File name is uncorrect!");
			return "";
		}
		String strDs = strFile.substring(iStart + 1, iEnd - 1);
		return strDs;
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		frame = new DissolveDatasetVector();

		frame.setVisible(true);
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		// TODO Auto-generated method stub
		String Cmd = e.getActionCommand();
		if (Cmd.equals("打开工作空间")) {
			Dlg.setFileFilter(new FileNameExtensionFilter("sxw,smw,sxwu,smwu",
					"sxw", "sxwu", "smw", "smwu"));
			int DlgReturn = Dlg.showOpenDialog(this);
			if (DlgReturn == JFileChooser.APPROVE_OPTION) {
				String FilePath = Dlg.getSelectedFile().getAbsolutePath();
				WorkspaceConnectionInfo Info = new WorkspaceConnectionInfo(
						FilePath);
				mapCtl.getMap().setWorkspace(workspace);
				
				if (workspace.open(Info)) {
					System.out.println("打开工作空间成功");
					DatasetVector datasetVector=(DatasetVector) workspace.getDatasources().get(0).getDatasets().get("ThiessenPolygon");
					mapCtl.getMap().getLayers().add(datasetVector, true);
					mapCtl.getMap().refresh();
				} else {
					System.out.println("打开工作空间失败");
				}
			}
		} else if (Cmd.equals("打开数据源")) {
			Dlg.setFileFilter(new FileNameExtensionFilter("sdb,udb", "sdb",
					"udb"));
			int DlgReturn = Dlg.showOpenDialog(this);
			if (DlgReturn == JFileChooser.APPROVE_OPTION) {
				String FilePath = Dlg.getSelectedFile().getAbsolutePath();
				DatasourceConnectionInfo Info = new DatasourceConnectionInfo(
						FilePath, PathToName(FilePath), "");
				workspace = GetWorkspace();
				mapCtl.getMap().setWorkspace(workspace);
				Datasource Ds = workspace.getDatasources().open(Info);
				if (Ds != null) {
					System.out.println("打开数据源成功");
				} else {
					System.out.println("打开数据源失败");
				}
			}
		} else if (Cmd.equals("放大")) {
			mapCtl.setAction(Action.ZOOMIN);
		} else if (Cmd.equals("缩小")) {
			mapCtl.setAction(Action.ZOOMOUT);
		} else if (Cmd.equals("自由缩放")) {
			mapCtl.setAction(Action.ZOOMFREE);
		} else if (Cmd.equals("平移")) {
			mapCtl.setAction(Action.PAN);
		} else if (Cmd.equalsIgnoreCase("全幅显示")) {
			mapCtl.getMap().viewEntire();
		} else if (Cmd.equalsIgnoreCase("选择")) {
			mapCtl.setAction(Action.SELECT);
		} else if (Cmd.equals("数据集融合")) {
			try {
				Datasource ds=workspace.getDatasources().get(0);
				if (ds==null) {
					return;
				}
				DatasetVector dtv=(DatasetVector) ds.getDatasets().get("ThiessenPolygon");
				if (dtv==null) {
					return;
				}
				String dtvNewName=ds.getDatasets().getAvailableDatasetName("New_"+dtv.getName());
				String[] fieldNames=new String[]{"bsc"};
				DissolveParameter dissolveParameter=new DissolveParameter();
				dissolveParameter.setDissolveType(DissolveType.MULTIPART);
				dissolveParameter.setFieldNames(fieldNames);
				dissolveParameter.setTolerance(0.0000008338);				
				DatasetVector datasetVector=GeneralizeAnalyst.dissolve(dtv, ds, dtvNewName, dissolveParameter);
				if (datasetVector==null) {
					return;
				}
				mapCtl.getMap().getLayers().add(datasetVector, true);
				mapCtl.getMap().refresh();
			} catch (Exception ex) {
				System.out.println(ex.getMessage());
			}
		}
	}
}

class SMOJ_Sample_this_windowAdapter extends WindowAdapter {
	private DissolveDatasetVector adaptee;

	SMOJ_Sample_this_windowAdapter(DissolveDatasetVector adaptee) {
		this.adaptee = adaptee;
	}

	public void windowClosing(WindowEvent e) {
		adaptee.this_windowClosing(e);
	}
}

