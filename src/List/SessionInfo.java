package List;

/******************************************************************************* 
 * 
 * Copyright (c) Weaver Info Tech Co. Ltd 
 * 
 * SessionInfo 
 * 
 * app.backend.model.SessionInfo.java 
 * TODO: File description or class description. 
 * 
 * @author: Administrator 
 * @since:  2014-5-26 
 * @version: 1.0.0 
 * 
 * @changeLogs: 
 *     1.0.0: First created this class. 
 * 
 ******************************************************************************/  

  
import java.io.Serializable;  
  
/** 
 * @author Administrator 
 * 
 */  
@SuppressWarnings("serial")  
public class SessionInfo implements Serializable{  
    private int id;  
    private String url;  
    public int getId() {  
  
        return id;  
    }  
    public void setId(int id) {  
  
        this.id = id;  
    }  
  
    public String getUrl() {  
  
        return url;  
    }

    @Override
    public String toString() {
        return "SessionInfo{" +
                "id=" + id +
                ", url='" + url + '\'' +
                '}';
    }

    public void setUrl(String url) {
  
        this.url = url;  
    }  
  
    /* (non-Javadoc) 
     * @see java.lang.Object#hashCode() 
     */  
    @Override  
    public int hashCode() {  
        return id;  
    }  
  
    /* (non-Javadoc) 
     * @see java.lang.Object#equals(java.lang.Object) 
     */  
     @Override  
	 public boolean equals(Object o) {  
	        if (o == null) {  
	            return false;  
	        } else {  
	            if (o.getClass() != this.getClass()) {  
	                return false;  
	            } else {  
	                final SessionInfo s = (SessionInfo) o;  
	                return s.id == this.id;  
	            }  
	        }  
	    }  
}