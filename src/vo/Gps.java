package vo;

public class Gps {
	private double wgLat;
	private double wgLon;
 
	public Gps(double wgLat,double wgLon) {
		setWgLon(wgLon);
		setWgLat(wgLat);		
	}
 
	public double getWgLat() {
		return wgLat;
	}
 
	public void setWgLat(double wgLat) {
		this.wgLat = wgLat;
	}
 
	public double getWgLon() {
		return wgLon;
	}
 
	public void setWgLon(double wgLon) {
		this.wgLon = wgLon;
	}
 
	@Override
	public String toString() {
		return wgLat + "," + wgLon;
	}
}
