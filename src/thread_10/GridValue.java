package thread_10;

import java.math.BigDecimal;

public class GridValue {
	
	private BigDecimal value;
	private Integer  row;
	private Integer  column;
	
	public BigDecimal getValue() {
		return value;
	}
	public void setValue(BigDecimal value) {
		this.value = value;
	}
	public Integer getRow() {
		return row;
	}
	public void setRow(Integer row) {
		this.row = row;
	}
	public Integer getColumn() {
		return column;
	}
	public void setColumn(Integer column) {
		this.column = column;
	}	
}
