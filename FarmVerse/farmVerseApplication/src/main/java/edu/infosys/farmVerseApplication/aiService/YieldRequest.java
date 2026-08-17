package edu.infosys.farmVerseApplication.aiService;

public class YieldRequest {
	private String inputs;

	public YieldRequest()
	{
		
	}
	
	public YieldRequest(String inputs) {
		super();
		this.inputs = inputs;
	}
	public String getInputs() {
		return inputs;
	}

	public void setInputs(String inputs) {
		this.inputs = inputs;
	}


}
