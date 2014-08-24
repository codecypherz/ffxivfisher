package ffxiv.fisher.servlet;

public enum HttpResponseCode {
	
	BAD_REQUEST(400),
	UNAUTHORIZED(401),
	PAYMENT_REQUIRED(402),
	FORBIDDEN(403),
	NOT_FOUND(404),
	INTERNAL_ERROR(500),
	NOT_IMPLEMENTED(501);
	
	private final int code;
	
	private HttpResponseCode(int code) {
		this.code = code;
	}
	
	public int getCode() {
		return code;
	}
}
