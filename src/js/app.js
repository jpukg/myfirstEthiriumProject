App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:9545',
  chairPerson: null,
  currentAccount: null,
  init: function () {
  
    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

   
    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Claims.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var claimArtifact = data;
      App.contracts.vote = TruffleContract(claimArtifact);

      // Set the provider for our contract
      App.contracts.vote.setProvider(App.web3Provider);

      App.getClaimStage();

      if(stageGbl === undefined) {
        console.log("init ", stageGbl);
        App.registerParties('0xf17f52151ebef6c7334fad080c5704d77216b732', '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef', '0x821aea9a577a9b44299b9c15c88cf3087f3b5544');
      } else {
        console.log("init else ", stageGbl);
      }
      
      App.getParty();
      App.viewClaim();
      App.viewVoucher();
      App.viewRepair();

      return App.bindEvents();
    });
  },

  bindEvents: function () {
    $(document).on('click', '.btn-vote', App.handleVote);
    $(document).on('click', '#win-count', App.handleWinner);
    // $(document).ready(function () {
    //   console.log("ready!");
    //   App.getClaimStage();
    //   App.getParty();
    //   App.viewClaim();
    //   App.viewVoucher();
    //   App.viewRepair();

    // });

    $(document).on('click', '.btn-registerClaim', function () {
      var policyNo = $('#policyNo').val();
      var claimDate = $('#claimDate').val();
      var location = $('#location').val();
      var claimDescription = $('#claimDescription').val();
      // $('#smartwizard').smartWizard('showStep', 2);
      // alert('Register claimm policyNo : ' + ad);
      //App.handleRegisterClaim(policyNo, claimDate, location, claimDescription);

    });
  },
 

  registerParties: function (_claimant, _provider, _expert) {
    var voteInstance;
    App.contracts.vote.deployed().then(function (instance) {
      alert('dd' + _claimant);
      voteInstance = instance;
      return voteInstance.registerParty(_claimant, _provider, _expert);
    }).then(function (result) {
      alert(result);
      if (result.receipt.status == '0x01')
        alert(" is registered successfully")
      else
        alert(" account registeration failed due to revert")
    }).catch(function (err) {
      // alert(addr + " account registeration failed")
    })
  },

  getClaimStage: function () {
    App.contracts.vote.deployed().then(function (instance) {
      return instance.getStage();
    }).then(function (result) {
       console.log("Stage :" , result.toString());
      stageGbl = result.toString();
      App.chairPerson = result.toString();
      App.currentAccount = web3.eth.coinbase;
      if (App.chairPerson != App.currentAccount) {
        jQuery('#address_div').css('display', 'none');
        jQuery('#register_div').css('display', 'none');
      } else {
        jQuery('#address_div').css('display', 'block');
        jQuery('#register_div').css('display', 'block');
      }
    })
  },

  viewClaim: function () {
    var voteInstance;
    App.contracts.vote.deployed().then(function (instance) {
      voteInstance = instance;
      return voteInstance.viewClaim();
    }).then(function (result) {

      console.log('View claim', result.toString());
      // var array = JSON.parse("[" + result.toString() + "]");
      var array = result.toString().split(",").map(Number);

      _idPolicyGbl = array[0];
      _dateClaimGbl = array[1];
      _dtLocationGbl = array[2];
      _dtClaimGbl = array[3];

      $("#policyNo").val(_idPolicyGbl);
      $("#claimDate").val(_dateClaimGbl);
      $("#location").val(_dtLocationGbl);
      $("#claimDesc").val(_dtClaimGbl);

      if (result.receipt.status == '0x01')
        alert(" is registered successfully")
      else
        alert(" account registeration failed due to revert")
    }).catch(function (err) {
      // alert(addr + " account registeration failed")
    })
  },

  viewVoucher: function () {
    var voteInstance;
    App.contracts.vote.deployed().then(function (instance) {
      voteInstance = instance;
      return voteInstance.viewVoucher();
    }).then(function (result) {
      console.log('viewVoucher', result.toString());
      
      $("#voucherId").val(result.toString());
      if (result.receipt.status == '0x01')
        alert(" is registered successfully")
      else
        alert(" account registeration failed due to revert")
    }).catch(function (err) {
      // alert(addr + " account registeration failed")
    })
  },

  viewRepair: function () {
    var voteInstance;
    App.contracts.vote.deployed().then(function (instance) {
      voteInstance = instance;
      return voteInstance.viewRepair();
    }).then(function (result) {
      console.log('viewRepair', result.toString());

      var array = result.toString().split(",").map(Number);

      _amtRepairGbl = array[0];
      _dtRepairGbl = array[1];

      $("#repairAmount").val(_amtRepairGbl);
      $("#repairDesc").val(_dtRepairGbl);

      if (result.receipt.status == '0x01')
        alert(" is registered successfully")
      else
        alert(" account registeration failed due to revert")
    }).catch(function (err) {
      // alert(addr + " account registeration failed")
    })
  },


  viewExpert: function () {
    var voteInstance;
    App.contracts.vote.deployed().then(function (instance) {
      voteInstance = instance;
      return voteInstance.viewExpert();
    }).then(function (result) {
      console.log('viewExpert', result.toString());
      if (result.receipt.status == '0x01')
        alert(" is registered successfully")
      else
        alert(" account registeration failed due to revert")
    }).catch(function (err) {
      // alert(addr + " account registeration failed")
    })
  },


  getParty: function () {
    var voteInstance;
    App.contracts.vote.deployed().then(function (instance) {
      voteInstance = instance;
      return voteInstance.getParty();
    }).then(function (result) {
      partyGbl = result.toString();
      console.log('getParty : ' + result);
      if (result == '0')
        // App.getClaimStage();

        console.log("dsf");
      else
        alert(" account registeration failed due to revert")
    }).catch(function (err) {
      // alert(addr + " account registeration failed")
    })
  },

  handleRegisterClaim: function (policyNo, claimDate, location, claimDescription) {
    var voteInstance;
    App.contracts.vote.deployed().then(function (instance) {
      voteInstance = instance;
      return voteInstance.registerClaim(policyNo, claimDate, location, claimDescription);
    }).then(function (result) {
      alert(result);
      if (result.receipt.status == '0x01')
        alert(" is registered successfully")
      else
        alert(" account registeration failed due to revert")
    }).catch(function (err) {
      // alert(addr + " account registeration failed")
    })
  },

   


};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
