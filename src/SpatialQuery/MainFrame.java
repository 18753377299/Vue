package SpatialQuery;

import java.awt.BorderLayout;
import java.awt.Frame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JToolBar;
import javax.swing.SwingUtilities;

import com.supermap.data.SpatialQueryMode;
import com.supermap.data.Workspace;
import com.supermap.ui.GeometrySelectedEvent;
import com.supermap.ui.GeometrySelectedListener;
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

public class MainFrame extends JFrame {

	private static final long serialVersionUID = 1L;

	private JPanel m_contentPane;

	private JToolBar m_jToolBar;

	private JButton m_containButton;

	private JButton m_disjointButton;

	private JButton m_intersectButton;

	private JLabel m_statusLabel;

	private SampleRun m_sampleRun;

	private MapControl m_mapControl;

	private Workspace m_workspace;
    
	private static String m_statusText1 = "请在地图中选择查询的对象";
	private static String m_statusText2 = "请点击相应的按钮进行查询";
	/**
	 * 程序入口点
	 */
	public static void main(String[] args) {
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				MainFrame thisClass = new MainFrame();
				thisClass.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
				thisClass.setVisible(true);
			}
		});
	}

	/**
	 * 构造函数
	 */
	public MainFrame() {
		super();
		initialize();
	}

	/**
	 * 初始化窗体
	 */
	private void initialize() {
		//最大化显示窗体
		this.setExtendedState(Frame.MAXIMIZED_BOTH);
		this.setSize(800, 500);
		this.setContentPane(getJContentPane());
		this.setTitle("空间查询");
		this.addWindowListener(new java.awt.event.WindowAdapter() {

			// 在主窗体加载时，初始化SampleRun类型，来完成功能的展现
			public void windowOpened(java.awt.event.WindowEvent e) {
				m_workspace = new Workspace();
				m_statusLabel.setText(m_statusText1);
				m_mapControl
						.addGeometrySelectedListener(new GeometrySelectedListener() {

							public void geometrySelected(GeometrySelectedEvent e) {
								if (e.getCount() != 0) {
									m_disjointButton.setEnabled(true);
									m_containButton.setEnabled(true);
									m_intersectButton.setEnabled(true);
									m_statusLabel.setText(m_statusText2);
								}
							}

						});
				m_sampleRun = new SampleRun(m_mapControl, m_workspace);
			}

			// 在窗体关闭时，需要释放相关的资源
			public void windowClosing(java.awt.event.WindowEvent e) {
				m_mapControl.dispose();
				m_workspace.dispose();

			}
		});
	}

	/**
	 * 获取m_contentPane
	 */
	private JPanel getJContentPane() {
		if (m_contentPane == null) {
			m_contentPane = new JPanel();
			m_contentPane.setLayout(new BorderLayout());
			m_contentPane.add(getJToolBar(), BorderLayout.NORTH);
			m_contentPane.add(getMapControl(), BorderLayout.CENTER);
		}
		return m_contentPane;
	}

	/**
	 * 获取m_mapControl
	 */
	private MapControl getMapControl() {
		if (m_mapControl == null) {
			m_mapControl = new MapControl();
		}
		return m_mapControl;
	}

	/**
	 * 获取m_jToolBar
	 */
	private JToolBar getJToolBar() {
		if (m_jToolBar == null) {
			m_jToolBar = new JToolBar();
			m_jToolBar
					.setLayout(new BoxLayout(getJToolBar(), BoxLayout.X_AXIS));
			m_jToolBar.setFloatable(false);
			m_jToolBar.add(getContainButton());
			m_jToolBar.add(getIntersectButton());
			m_jToolBar.add(getDisjointButton());
			m_jToolBar.add(new JLabel("                                 "));
			m_jToolBar.add(getStatusLabel());
		}
		return m_jToolBar;
	}

	/**
	 * 获取m_containButton
	 */
	private JButton getContainButton() {
		if (m_containButton == null) {
			m_containButton = new JButton();
			m_containButton.setText("包含查询");
			m_containButton.addActionListener(new ActionListener() {

				public void actionPerformed(ActionEvent e) {
					m_sampleRun.query(SpatialQueryMode.CONTAIN);
					setUnEnable();
				}

			});
		}
		return m_containButton;
	}

	/**
	 * 获取m_intersectButton
	 */
	private JButton getIntersectButton() {
		if (m_intersectButton == null) {
			m_intersectButton = new JButton();
			m_intersectButton.setText("相交查询");
			m_intersectButton.addActionListener(new ActionListener() {

				public void actionPerformed(ActionEvent e) {
					m_sampleRun.query(SpatialQueryMode.INTERSECT);
					setUnEnable();
				}

			});
		}
		return m_intersectButton;
	}

	/**
	 * 获取m_disjointButton
	 */
	private JButton getDisjointButton() {
		if (m_disjointButton == null) {
			m_disjointButton = new JButton();
			m_disjointButton.setText("分离查询");
			m_disjointButton.addActionListener(new ActionListener() {

				public void actionPerformed(ActionEvent e) {
					m_sampleRun.query(SpatialQueryMode.DISJOINT);
					setUnEnable();
				}

			});
		}
		return m_disjointButton;
	}

	/**
	 * 获取m_statusLabel
	 */
	private JLabel getStatusLabel() {
		if (m_statusLabel == null) {
			m_statusLabel = new JLabel();
		}
		return m_statusLabel;
	}

	/**
	 * 设置按钮不可用
	 */
	private void setUnEnable() {
		m_disjointButton.setEnabled(false);
		m_containButton.setEnabled(false);
		m_intersectButton.setEnabled(false);
		m_statusLabel.setText(m_statusText1);
	}
}

