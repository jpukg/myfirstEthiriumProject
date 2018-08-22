pragma solidity ^0.4.17;
contract Claims {
    
    //Structure to hold the details of a claim
    struct Claim {
        uint256 idPolicy;//policy number
        uint256 dateClaim;//date of claim
        string dtLocation;//location details
        string dtClaim;//claim details
    }
    
    Claim public claim;//claim details
    
    string public idVoucher;//voucher details
    
    uint256 public amRepair;//repair amount
    string public dtRepair;//repair details
    
    bool public rqExpert;//expert requested
    string public descExpert;//expert description details
    
    address public insurer;//owner of the smart contract
    address public claimant;//customer
    address public provider;//service provider
    address public expert;//expert
    
    //contractInit = Contract initiated
    //claimReg = Claim registered
    //claimRec = Claim received
    //voucherAva = Voucher available
    //voucherRec = Voucher received
    //voucherExc = Voucher exchanged
    //voucherPro = Voucher in the process
    //expertVal = Expert validation
    //expertPrc = Expert validation in the process
    //expertRep = Expert report available
    //claimPaid = Payment done and closed
    enum Stage {contractInit, claimReg, claimRec, voucherAva, voucherRec, voucherExc, voucherPro, expertVal, expertPrc, expertRep, claimPaid}
    Stage public stage = Stage.contractInit;
    
    //modifier to check the valid Stage
    modifier validStage(Stage reqStage)
    { require(stage == reqStage);
      _;
    }
    
    //function - Initialize contract
    function Claims(address _claimant, address _provider, address _expert) public payable{    //constructor
                
        //Initialize insurer with address of smart contract’s owner
        insurer = msg.sender;
        //Initialize claimant with address of claimant 
        claimant = _claimant;
        //Initialize provider with address of provider 
        provider = _provider;
        //Initialize expert with address of expert
        expert = _expert;

    }
    
    //functions - Get party
    function getParty() public constant returns(uint8 _party){
        _party = 0;
        if (claimant == msg.sender) {
            _party = 1;
        }
        if (provider == msg.sender) {
            _party = 2;
        }
        if (expert == msg.sender) {
            _party = 3;
        }
    }
    
    //event to notify claim registered
    event claimRegistered();
    
    //modifier to check only for customer (claimant)
    modifier onlyClaimant {
        require(msg.sender == claimant);
        _;
    }
    
    //functions - Register Claim
    function registerClaim(uint256 _idPolicy, uint256 _dateClaim, string _dtLocation, string _dtClaim) public validStage(Stage.contractInit) onlyClaimant payable{
    claim.idPolicy = _idPolicy;
    claim.dateClaim = _dateClaim;
    claim.dtLocation = _dtLocation;
    claim.dtClaim = _dtClaim;
    stage = Stage.claimReg;
    claimRegistered();
    }
    
    //functions - View claim
    function viewClaim() public constant returns(uint256 _idPolicy, uint256 _dateClaim, string _dtLocation, string _dtClaim) {
    _idPolicy = claim.idPolicy;
    _dateClaim = claim.dateClaim;
    _dtLocation = claim.dtLocation;
    _dtClaim = claim.dtClaim;
    }
    
    //modifier to check only for owner (insurer)
    modifier onlyInsurer {
        require(msg.sender == insurer);
        _;
    }
    
    //functions - Claim received
    function receivedClaim() public validStage(Stage.claimReg) onlyInsurer payable {
    stage = Stage.claimRec;
    }
    
    //functions - Voucher available
    function availableVoucher(string _idVoucher) public validStage(Stage.claimRec) onlyInsurer payable{
    idVoucher = _idVoucher;
    stage = Stage.voucherAva;
    }

    //functions - View voucher
    function viewVoucher() public constant returns(string _idVoucher) {
    _idVoucher = idVoucher;
    }
    
    //functions - Voucher received
    function receivedVoucher() public validStage(Stage.voucherAva) onlyClaimant payable{
    stage = Stage.voucherRec;
    }
    
    //modifier to check only for service provider
    modifier onlyProvider {
        require(msg.sender == provider);
        _;
    }
    
    //functions - Voucher exchanged
    function exchangeVoucher(uint256 _amRepair, string _dtRepair) public validStage(Stage.voucherRec) onlyProvider payable{
    amRepair = _amRepair;
    dtRepair = _dtRepair;
    stage = Stage.voucherExc;
    }
    
    //functions - View repair details
    function viewRepair() public constant returns(uint256 _amRepair, string _dtRepair) {
    _amRepair = amRepair;
    _dtRepair = dtRepair;
    }
    
    //functions - Voucher in the process by owner (insurer)
    function processVoucher() public validStage(Stage.voucherExc) onlyInsurer payable{
    stage = Stage.voucherPro;
    }
    
    //functions - Expert validation
    function validationExpert(bool _rqExpert) public validStage(Stage.voucherPro) onlyInsurer payable{
    rqExpert == _rqExpert; 
    stage = Stage.expertVal;
    }
    
    //modifier to check only for expert
    modifier onlyExpert {
        require(msg.sender == expert);
        _;
    }
    
    //functions - Expert validation in the process
    function processExpert() public validStage(Stage.expertVal) onlyExpert payable{
    stage = Stage.expertPrc;
    }
 
    //functions - Expert report available
    function reportExpert(string _descExpert) public validStage(Stage.expertPrc) onlyExpert payable{
    descExpert = _descExpert;
    stage = Stage.expertRep;
    }
    
    //functions - View expert report
    function viewExpert() public constant returns(string _descExpert) {
    _descExpert = descExpert;
    }
    
    //functions - Claim paid
    function paidClaim() public validStage(Stage.expertRep) onlyInsurer payable{
    stage = Stage.claimPaid;
    }
    
    function getStage() public constant returns(Stage){
        return (stage);
    }
}