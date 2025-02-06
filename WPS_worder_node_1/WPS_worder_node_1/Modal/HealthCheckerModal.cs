namespace WPS_worder_node_1.Modal
{
    public class HealthCheckerModal
    {
        public int StatusCode { get; set; }
        public string? ErrorMessage { get; set; }
        public bool IsError { get; set; }
        public int ResponseTime { get; set; }
    }
}
