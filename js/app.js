var app = angular.module('myApp',['ngRoute', 'ngAnimate']);


app.controller('navController', function ($scope){});

app.controller('PA0_controller', function($scope){
    $scope.encrypt = function(plaintext){
      var ciphertext = "";
      for(var i=0;i<plaintext.length;i++){
        if(plaintext[i]>='a'&&plaintext[i]<='z')
          ciphertext += String.fromCharCode(25 - plaintext.charCodeAt(i) + 2*97);
        else if(plaintext[i]>='A'&&plaintext[i]<='Z')
          ciphertext += String.fromCharCode(25 - plaintext.charCodeAt(i) + 2*65);
        else
          ciphertext += plaintext[i];
      }
      return ciphertext;
    }
    $scope.decrypt = function(ciphertext){
      var plaintext = "";
      for(var i=0;i<ciphertext.length;i++){
        if(ciphertext[i]>='a'&&ciphertext[i]<='z')
          plaintext += String.fromCharCode(25 - ciphertext.charCodeAt(i) + 2*97);
        else if(ciphertext[i]>='A'&&ciphertext[i]<='Z')
          plaintext += String.fromCharCode(25 - ciphertext.charCodeAt(i) + 2*65);
        else
          plaintext += ciphertext[i];
      }
      return plaintext;
    }
    $scope.plaintext_change = function(){
      $scope.ciphertext = $scope.encrypt($scope.plaintext);
    }
    $scope.ciphertext_change = function(){
      $scope.plaintext = $scope.decrypt($scope.ciphertext);
    }
});

app.controller('PA1_controller',function($scope){

  /* Utilities */
  $scope.check_non_alpha = function(p){
    for(var i=0;i<p.length;i++){
      if(!((p[i]>='a'&&p[i]<='z')||(p[i]>='A'&&p[i]<='Z')))
        return 1;
    }
    return 0;
  }
  $scope.filter_alphas = function(p){
    var c = "";
    for(var i=0;i<p.length;i++){
      if(p[i]>="a" && p[i]<="z")
        c += p[i];
    }
    return c;
  }

  /* Encryption Functions */
  $scope.encrypt_caesar = function(p, k){
    var c = "";
    k = parseInt(k, 10);
    for(var i=0;i<p.length;i++){
      if(p[i]>='a' && p[i]<='z')
        c += String.fromCharCode((p.charCodeAt(i)-97+k)%26+97);
      else if(p[i]>='A' && p[i]<='Z')
        c += String.fromCharCode((p.charCodeAt(i)-65+k)%26+65);
      else
        c += p[i];
    }
    return c;
  }
  $scope.encrypt_vignere = function(p, k){
    var c = "";
    var j = 0;
    k = k.toLowerCase();
    for(var i=0;i<p.length;i++){
      if(p[i]>='a' && p[i]<='z'){
        c += String.fromCharCode((p.charCodeAt(i)-97+k.charCodeAt(j%k.length)-97+1)%26+97);
        j++;
      }else if(p[i]>='A' && p[i]<='Z'){
        c += String.fromCharCode((p.charCodeAt(i)-65+k.charCodeAt(j%k.length)-97+1)%26+65);
        j++;
      }else
        c += p[i];
    }
    return c;
  }
  $scope.encrypt_playfair = function(p, k){
    var P = p;
    p = p.toLowerCase();
    k = k.toLowerCase();
    p = $scope.filter_alphas(p);
    var check = {};
    var mat = new Array(5);
    for(var i=0;i<5;i++)
      mat[i] = new Array(5);
    var q = "";
    for(var i=0;i<k.length;i++){
      if(!(k[i] in check)){
        check[k[i]] = 1;
        q += k[i];
      }
      if(q.length == 25)break;
    }
    var igc;
    if(!("j" in check))
      igc = 9;
    else if(!("i" in check))
      igc = 8;
    else{
      for(var i=0;i<26;i++){
        if(!(String.fromCharCode(i+97) in check)){
          igc = i;
          break;
        }
      }
    }
    for(var i=0;i<26;i++){
      if(igc == i)continue;
      if(!(String.fromCharCode(i+97) in check)){
        check[String.fromCharCode(i+97)] = 1;
        q += String.fromCharCode(i+97);
      }
    }
    for(var i=0;i<5;i++){
      for(var j=0;j<5;j++)
        mat[i][j] = q[5*i+j];
    }
    var map = {};
    for(var i=0;i<5;i++){
      for(var j=0;j<5;j++){
        map[mat[i][j]] = [i,j];
      }
    }
    var i=0;
    while(1){
      if(i==p.length-1){
        if(p[i]=="x")
          p += "z";
        else
          p += "x";
        break;
      }
      if(p[i]==p[i+1]){
        if(p[i]=="x")
          p = p.substr(0,i+1)+"z"+p.substr(i+1,p.length-i-1);
        else
          p = p.substr(0,i+1)+"x"+p.substr(i+1,p.length-i-1);
      }
      i+=2;
      if(i>=p.length)
        break;
    }
    if(igc == 9){
      map["j"] = map["i"];
    }else{
      map[String.fromCharCode(igc+97)] = map["j"];
    }
    var c = "";
    for(var i=0;i<p.length;i+=2){
      var r1 = map[p[i]][0];
      var r2 = map[p[i+1]][0];
      var c1 = map[p[i]][1];
      var c2 = map[p[i+1]][1];
      var R1,R2,C1,C2;
      if(r1 == r2){
        R1 = R2 = r1;
        C1 = (c1+1)%5;
        C2 = (c2+1)%5;
      }else if(c1 == c2){
        C1 = C2 = c1;
        R1 = (r1+1)%5;
        R2 = (r2+1)%5;
      }else{
        R1 = r1, C1 = c2;
        R2 = r2, C2 = c1;
      }
      c = c + mat[R1][C1] + mat[R2][C2];
    }
    var C = "";
    var j=0;
    for(var i=0;i<P.length;i++){
      if(P[i]>="a"&&P[i]<="z"){
        C += c[j];
        j++;
      }else if(P[i]>="A"&&P[i]<="Z"){
        C += c[j].toUpperCase();
        j++;
      }else{
        C += P[i];
      }
    }
    while(j<c.length){
      C += c[j];
      j++;
    }
    C.toUpperCase();
    return C;
  }

  /* DES Encryption */
  
  
  /* Analysis */
  $scope.r_f_stat = function(p, q){
    var map = {};
    p = p.toLowerCase();
    for(var i=0;i<p.length;i++){
      if(p[i]>="a" && p[i]<="z"){
        if(!(p[i] in map))
          map[p[i]] = 1;
        else
          map[p[i]] = map[p[i]] + 1;
      }
    }
    for(var i=0;i<26;i++){
      if(!(String.fromCharCode(i+97) in map))
        map[String.fromCharCode(i+97)] = 0;
    }
    var freq = Object.values(map);
    freq.sort(function(a, b){return a<b;});
    if(q == 1)
      $scope.reference = freq[0];
    var r_f = [];
    for(var i=0;i<freq.length;i++)
      r_f.push(freq[i]/$scope.reference);
    return r_f;
  }
  $scope.analysis = function(){
    $scope.r_f_stat_plaintext = $scope.r_f_stat($scope.plaintext, 1);
    $scope.r_f_stat_caeser = $scope.r_f_stat($scope.caeser_ciphertext, 0);
    $scope.r_f_stat_vignere = $scope.r_f_stat($scope.vignere_ciphertext, 0);
    $scope.r_f_stat_playfair = $scope.r_f_stat($scope.playfair_ciphertext, 0);
    var data = {"xData": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"yData":[{
      "name": "Plaintext",
      "data": $scope.r_f_stat_plaintext
    },{
      "name": "Caeser Ciphertext",
      "data": $scope.r_f_stat_caeser
    },{
      "name": "Vignere Ciphertext",
      "data": $scope.r_f_stat_vignere
    },{
      "name": "Playfair Ciphertext",
      "data": $scope.r_f_stat_playfair
    }]};
    $scope.lineChartYData=data.yData;
    $scope.lineChartXData=data.xData;
  }
  
  
  /* Change */
  $scope.plaintext_change = function(){
    $scope.plaintext_err = 0;
  }
  $scope.caeser_key_change = function(){
    $scope.caeser_key_err_1 = 0;
    $scope.caeser_key_err_2 = 0;
  }
  $scope.vignere_key_change = function(){
    $scope.vignere_key_err_1 = 0;
    $scope.vignere_key_err_2 = 0;
  }
  $scope.playfair_key_change = function(){
    $scope.playfair_key_err_1 = 0;
    $scope.playfair_key_err_2 = 0;
  }
  $scope.des_key_change = function(){
    $scope.des_key_err_1 = 0;
    $scope.des_key_err_2 = 0;
  }
  $scope.clear = function(p){
    if(p == "caeser_key")
      $scope.caeser_key = "";
    else if(p == "vignere_key")
      $scope.vignere_key = "";
    else if(p == "playfair_key")
      $scope.playfair_key = "";
    else if(p == "des_key")
      $scope.des_key = "";
  }
  
  /* Form Submit */
  $scope.remove_errors = function(){
    $scope.plaintext_err = 0;
    $scope.caeser_key_err_1 = 0;
    $scope.caeser_key_err_2 = 0;
    $scope.vignere_key_err_1 = 0;
    $scope.vignere_key_err_2 = 0;
    $scope.playfair_key_err_1 = 0;
    $scope.playfair_key_err_2 = 0;
    $scope.des_key_err_1 = 0;
    $scope.des_key_err_2 = 0;
  }
  $scope.show_errors = function(err){
    for(var i=0;i<err.length;i++){
      if(err[i] == "plaintext_err")
        $scope.plaintext_err = 1;
      else if(err[i] == "caeser_key_err_1")
        $scope.caeser_key_err_1 = 1;
      else if(err[i] == "caeser_key_err_2")
        $scope.caeser_key_err_2 = 1;
      else if(err[i] == "vignere_key_err_1")
        $scope.vignere_key_err_1 = 1;
      else if(err[i] == "vignere_key_err_2")
        $scope.vignere_key_err_2 = 1;
      else if(err[i] == "playfair_key_err_1")
        $scope.playfair_key_err_1 = 1;
      else if(err[i] == "playfair_key_err_2")
        $scope.playfair_key_err_2 = 1;
      else if(err[i] == "des_key_err_1")
        $scope.des_key_err_1 = 1;
      else if(err[i] == "des_key_err_2")
        $scope.des_key_err_2 = 1;
    }
  }
  $scope.active = function(){
    var c = 0;
    if($scope.plaintext.length>0)c++;
    if($scope.caeser_key.length>0)c++;
    if($scope.vignere_key.length>0)c++;
    if($scope.playfair_key.length>0)c++;
    if($scope.des_key.length>0)c++;
    if(c==5)c=1;
    else c=0;
    return c;
  }
  $scope.form_validate = function(){
    var err = [];
    if(!$scope.active()){
      if($scope.plaintext.length==0)err.push("plaintext_err");
      if($scope.caeser_key.length==0)err.push("caeser_key_err_1");
      if($scope.vignere_key.length==0)err.push("vignere_key_err_1");
      if($scope.playfair_key.length==0)err.push("playfair_key_err_1");
      if($scope.des_key.length==0)err.push("des_key_err_1");
    }
    if($scope.caeser_key.length>0){
      if(isNaN($scope.caeser_key))
        err.push("caeser_key_err_2");
    }
    if($scope.vignere_key.length>0){
      if($scope.check_non_alpha($scope.vignere_key))
        err.push("vignere_key_err_2");
    }
    if($scope.playfair_key.length>0){
      if($scope.check_non_alpha($scope.playfair_key))
        err.push("playfair_key_err_2");
    }
    if($scope.des_key.length>0){
      if($scope.check_hex($scope.des_key, 1))
        err.push("des_key_err_2");
    }
    return err;
  }
  $scope.form_submit = function(){
    var err = $scope.form_validate();
    if(err.length == 0){
      $scope.remove_errors();
      $scope.caeser_ciphertext = $scope.encrypt_caesar($scope.plaintext, $scope.caeser_key);
      $scope.vignere_ciphertext = $scope.encrypt_vignere($scope.plaintext, $scope.vignere_key);
      $scope.playfair_ciphertext = $scope.encrypt_playfair($scope.plaintext, $scope.playfair_key);
      $scope.des_ciphertext = $scope.encrypt_des($scope.plaintext, $scope.des_key);
      $scope.analysis();
      $scope.show_analysis = 1;
    }else{
      $scope.show_errors(err);
      $scope.show_analysis = 0;
    }
  }
});

app.controller('PA2_controller', function($scope){
    $scope.num_of_rounds = 16;
    $scope.key_1 = "";
    $scope.key_2 = "";
    $scope.plaintext_1 = "";
    $scope.plaintext_2 = "";
    $scope.ciphertext_1 = "";
    $scope.ciphertext_2 = "";
    $scope.round_text_1 = [];
    $scope.round_text_2 = [];
    $scope.key_err_1 = 0;
    $scope.key_err_2 = 0;
    $scope.p_c_err_1 = 0;
    $scope.p_c_err_2 = 0;
    $scope.p_err_1 = 0;
    $scope.p_err_2 = 0;
    $scope.c_err_1 = 0;
    $scope.c_err_2 = 0;
    $scope.show_analysis = 0;
    $scope.diff_bits = [];
    $scope.round_no = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

    /* Utilities */
    $scope.hex_2_binary = function(p){
      var c = "";
      for(var i=0;i<p.length;i++){
        var d = parseInt(p[i],16).toString(2);
        d = Array(4 - d.length + 1).join("0") + d;
        c += d;
      }
      return c;
    }
    $scope.binary_2_hex = function(p){
      var d = p.match(/.{1,4}/g).join(" ").split(" ");
      var c = "";
      for(var i=0;i<d.length;i++)
        c += parseInt(d[i],2).toString(16);
      return c;
    }
    $scope.binary_2_dec = function(p){
      return parseInt(p,2);
    }
    $scope.dec_2_binary = function(x,l){
      var c = x.toString(2);
      c = Array(l - c.length + 1).join("0") + c;
      return c;
    }
    $scope.xor = function(p,q){
      var c = "";
      for(var i=0;i<p.length;i++){
        if(p[i]===q[i])
          c += '0';
        else
          c += '1';
      }
      return c;
    }
    $scope.check_hex = function(p, d){
      if(d==1){
        if(p.length%16!=0)
          return 0;
      }
      for(var i=0;i<p.length;i++){
        if(isNaN(parseInt(p[i],16)))
          return 0;
      }
      return 1;
    }
    $scope.diff_bits_util = function(p,q){
      var c = 0;
      for(var i=0;i<p.length;i++){
        if(p[i] !== q[i])
          c=c+1;
      }
      return c;
    }
    

    /* Key Generation Functions */
    $scope.PC_1 = [57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
    $scope.PC_2 = [14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
    $scope.LCS = [0,1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
    $scope.left_circular_shift_util = function(key, k){
      var temp = key.substr(0,k);
      key = key.substr(k,key.length);
      key += temp;
      return key;
    }
    $scope.permuted_choice_1 = function(key){
      var c = "";
      for(var i=0;i<$scope.PC_1.length;i++)
        c += key[$scope.PC_1[i]-1];
      return c;
    }
    $scope.left_circular_shift = function(key, r){
      var k = $scope.LCS[r];
      var d = key.match(/.{1,28}/g).join(" ").split(" ");
      var key_l = d[0];
      var key_r = d[1];
      key_l = $scope.left_circular_shift_util(key_l, k);
      key_r = $scope.left_circular_shift_util(key_r, k);
      key = key_l + key_r;
      return key;
    }
    $scope.permuted_choice_2 = function(key){
      var c = "";
      for(var i=0;i<$scope.PC_2.length;i++)
        c += key[$scope.PC_2[i]-1];
      return c;
    }

    /* Round Functions */
    $scope.IP = [58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
    $scope.E = [32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
    $scope.P = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
    $scope.S_BOX = [[[],[],[],[]],[[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]],[[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]],[[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]],[[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],[13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],[10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],[3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]],[[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],[14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],[4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],[11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]],[[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],[10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],[9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],[4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]],[[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],[13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],[1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],[6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]],[[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],[1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],[7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],[2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]]];
    $scope.IP_inv = [40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];
    $scope.initial_permutation = function(p){
      var c = "";
      for(var i=0;i<$scope.IP.length;i++)
        c += p[$scope.IP[i]-1];
      return c;
    }
    $scope.expansion = function(p){
      var c = "";
      for(var i=0;i<$scope.E.length;i++)
        c += p[$scope.E[i]-1];
      return c;
    }
    $scope.s_box = function(p){
      var c = "";
      var d = p.match(/.{1,6}/g).join(" ").split(" ");
      for(var i=0;i<d.length;i++){
        var row = $scope.binary_2_dec(d[i][0] + d[i][5]);
        var q = d[i].substr(1,4);
        var col = $scope.binary_2_dec(q);
        var x = $scope.dec_2_binary($scope.S_BOX[i+1][row][col],4);
        c += x;
      }
      return c;
    }
    $scope.permutation = function(p){
      var c = "";
      for(var i=0;i<$scope.P.length;i++)
        c += p[$scope.P[i]-1];
      return c;
    }
    $scope.fun_F = function(p, key){
      p = $scope.expansion(p);
      p = $scope.xor(p,key);
      p = $scope.s_box(p);
      p = $scope.permutation(p);
      return p;
    }
    $scope.L_R_swap = function(p){
      var c = p.substr(32,64);
      c = c + p.substr(0,32);
      return c;
    }
    $scope.inverse_initial_permutation = function(p){
      var c = "";
      for(var i=0;i<$scope.IP_inv.length;i++)
        c += p[$scope.IP_inv[i]-1];
      return c;
    }

    /* Main Body */
    $scope.process_key_1 = function(){
      var key = $scope.hex_2_binary($scope.key_1.toUpperCase());
      key = $scope.permuted_choice_1(key);
      $scope.key_1_space = [""];
      for(var i=1;i<=16;i++){
        key = $scope.left_circular_shift(key, i);
        $scope.key_1_space.push($scope.permuted_choice_2(key));
      }
    }
    $scope.process_key_2 = function(){
      var key = $scope.hex_2_binary($scope.key_2.toUpperCase());
      key = $scope.permuted_choice_1(key);
      $scope.key_2_space = [""];
      for(var i=1;i<=16;i++){
        key = $scope.left_circular_shift(key, i);
        $scope.key_2_space.push($scope.permuted_choice_2(key));
      }
    }
    // Encryption of 8-byte block
    $scope.encrypt_block = function(plaintext, key_ind){
      plaintext = $scope.hex_2_binary(plaintext.toUpperCase());
      plaintext = $scope.initial_permutation(plaintext);
      var rnd_text = [plaintext];
      if(key_ind == 1)
        var key_space = $scope.key_1_space;
      else
        var key_space = $scope.key_2_space;
      for(var i=1;i<=$scope.num_of_rounds;i++){
        var c = plaintext.substr(32,64);
        var temp = $scope.fun_F(c,key_space[i]);
        c += $scope.xor(temp, plaintext.substr(0,32));
        rnd_text.push(c);
        plaintext = c;
      }
      plaintext = $scope.L_R_swap(plaintext);
      plaintext = $scope.inverse_initial_permutation(plaintext);
      if(key_ind == 1)
        $scope.round_text_1.push(rnd_text);
      else
        $scope.round_text_2.push(rnd_text);
      return $scope.binary_2_hex(plaintext).toUpperCase();
    }
    // Decryption of 8-byte block
    $scope.decrypt_block = function(ciphertext, key_ind){
      ciphertext = $scope.hex_2_binary(ciphertext.toUpperCase());
      ciphertext = $scope.initial_permutation(ciphertext);
      var rnd_text = [ciphertext];
      if(key_ind == 1)
        var key_space = $scope.key_1_space;
      else
        var key_space = $scope.key_2_space;
      for(var i=$scope.num_of_rounds;i>=1;i--){
        var c = ciphertext.substr(32,64);
        var temp = $scope.fun_F(c,key_space[i]);
        c += $scope.xor(temp, ciphertext.substr(0,32));
        rnd_text.push(c);
        ciphertext = c;
      }
      ciphertext = $scope.L_R_swap(ciphertext);
      ciphertext = $scope.inverse_initial_permutation(ciphertext);
      rnd_text.reverse();
      if(key_ind == 1)
        $scope.round_text_1.push(rnd_text);
      else
        $scope.round_text_2.push(rnd_text);
      return $scope.binary_2_hex(ciphertext).toUpperCase();
    }
    // Encryption
    $scope.encrypt = function(plaintext, key_ind){
      var c = "";
      if(key_ind == 1)
        $scope.round_text_1 = [];
      else
        $scope.round_text_2 = [];
      while(plaintext.length%16!=0)plaintext += "0";
      var d = plaintext.match(/.{1,16}/g).join(" ").split(" ");
      for(var i=0;i<d.length;i++)
        c += $scope.encrypt_block(d[i],key_ind);
      return c;
    }
    // Decryption
    $scope.decrypt = function(ciphertext, key_ind){
      var p = "";
      if(key_ind == 1)
        $scope.round_text_1 = [];
      else
        $scope.round_text_2 = [];
      var d = ciphertext.match(/.{1,16}/g).join(" ").split(" ");
      for(var i=0;i<d.length;i++)
        p += $scope.decrypt_block(d[i],key_ind);
      return p;
    }

    /* Analysis */
    $scope.analysis = function(){
      $scope.diff_bits = [];
      var sec = Math.min(Math.ceil($scope.plaintext_1.length/16),Math.ceil($scope.plaintext_2.length/16));
      for(var k=0;k<sec;k++){
        var sec_diff = [];
        for(var i=0;i<$scope.round_text_1[k].length;i++)
          sec_diff.push($scope.diff_bits_util($scope.round_text_1[k][i],$scope.round_text_2[k][i]));
        $scope.diff_bits.push(sec_diff);
      }
      var data = {"xData": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"yData":[{"name": "","data": $scope.diff_bits[0]}]};
      $scope.lineChartYData=data.yData;
      $scope.lineChartXData=data.xData;
    }

    /* Change */
    $scope.clear = function(p){
      if(p == 'key_1'){
        $scope.key_1 = "";
        if($scope.equal_key)
          $scope.key_2 = "";
      }else if(p == 'key_2'){
        $scope.key_2 = "";
        if($scope.equal_key)
          $scope.key_1 = "";
      }else if(p == 'plaintext_1'){
        $scope.plaintext_1 = "";
        if($scope.equal_plaintext)
          $scope.plaintext_2 = "";
      }else if(p == 'plaintext_2'){
        $scope.plaintext_2 = "";
        if($scope.equal_plaintext)
          $scope.plaintext_1 = "";
      }else if(p == 'ciphertext_1')
        $scope.ciphertext_1 = "";
      else if(p == 'ciphertext_2')
        $scope.ciphertext_2 = "";
    }
    $scope.equal_key_change = function(){
      if($scope.equal_key){
        if($scope.key_1.length>0)
          $scope.key_2 = $scope.key_1;
        else
          $scope.key_1 = $scope.key_2;
      }
    }
    $scope.equal_plaintext_change = function(){
      if($scope.equal_plaintext){
        if($scope.plaintext_1.length>0)
          $scope.plaintext_2 = $scope.plaintext_1;
        else
          $scope.plaintext_1 = $scope.plaintext_2;
      }
    }
    $scope.key_1_change = function(){
      $scope.key_err_1 = 0;
      if($scope.equal_key)
        $scope.key_2 = $scope.key_1;
    }
    $scope.key_2_change = function(){
      $scope.key_err_2 = 0;
      if($scope.equal_key)
        $scope.key_1 = $scope.key_2;
    }
    $scope.plaintext_1_change = function(){
      $scope.p_c_err_1 = 0;
      $scope.p_err_1 = 0;
      if($scope.equal_plaintext)
        $scope.plaintext_2 = $scope.plaintext_1;
    }
    $scope.plaintext_2_change = function(){
      $scope.p_c_err_2 = 0;
      $scope.p_err_2 = 0;
      if($scope.equal_plaintext)
        $scope.plaintext_1 = $scope.plaintext_2;
    }
    $scope.ciphertext_1_change = function(){
      $scope.p_c_err_1 = 0;
      $scope.c_err_1 = 0;
    }
    $scope.ciphertext_2_change = function(){
      $scope.p_c_err_2 = 0;
      $scope.c_err_2 = 0;
    }

    /* Form Submit */
    $scope.active_1 = function(){
      var a = $scope.key_1.length;
      var b = $scope.plaintext_1.length;
      var c = $scope.ciphertext_1.length;
      if(a>0)a=1;else a=0;
      if(b>0)b=1;else b=0;
      if(c>0)c=1;else c=0;
      return 4*a+2*b+c;
    }
    $scope.active_2 = function(){
      var a = $scope.key_2.length;
      var b = $scope.plaintext_2.length;
      var c = $scope.ciphertext_2.length;
      if(a>0)a=1;else a=0;
      if(b>0)b=1;else b=0;
      if(c>0)c=1;else c=0;
      return 4*a+2*b+c;
    }
    $scope.remove_errors = function(){
      $scope.key_err_1 = 0;
      $scope.key_err_2 = 0;
      $scope.p_c_err_1 = 0;
      $scope.p_c_err_2 = 0;
      $scope.p_err_1 = 0;
      $scope.p_err_2 = 0;
      $scope.c_err_1 = 0;
      $scope.c_err_2 = 0;
    }
    $scope.form_validate = function(){
      var err = [];
      var a = $scope.active_1();
      if(a == 4){
        err.push("p_c_err_1");
        if($scope.key_1.length!=16 || !$scope.check_hex($scope.key_1, 0))
          err.push("key_err_1");
      }else if(a>=1&&a<=3)
        err.push("key_err_1");
        if($scope.plaintext_1.length>0 && !$scope.check_hex($scope.plaintext_1, 0))
          err.push("p_err_1");
        if($scope.ciphertext_1.length>0 && !$scope.check_hex($scope.ciphertext_1, 1))
          err.push("c_err_1");
      else if(a>=5){
        if($scope.key_1.length!=16 || !$scope.check_hex($scope.key_1, 0))
          err.push("key_err_1");
        if($scope.plaintext_1.length>0 && !$scope.check_hex($scope.plaintext_1, 0))
          err.push("p_err_1");
        if(a!=9 && $scope.ciphertext_1.length>0 && !$scope.check_hex($scope.ciphertext_1, 1))
          err.push("c_err_1");
      }
      var b = $scope.active_2();
      if(b == 4){
        err.push("p_c_err_2");
        if($scope.key_2.length!=16 || !$scope.check_hex($scope.key_2, 0))
          err.push("key_err_2");
      }else if(b>=1&&b<=3)
        err.push("key_err_2");
        if($scope.plaintext_2.length>0 && !$scope.check_hex($scope.plaintext_2, 0))
          err.push("p_err_2");
        if($scope.ciphertext_2.length>0 && !$scope.check_hex($scope.ciphertext_2, 1))
          err.push("c_err_2");
      else if(b>=5){
        if($scope.key_2.length!=16 || !$scope.check_hex($scope.key_2, 0))
          err.push("key_err_2");
        if($scope.plaintext_2.length>0 && !$scope.check_hex($scope.plaintext_2, 0))
          err.push("p_err_2");
        if(b!=9 && $scope.ciphertext_2.length>0 && !$scope.check_hex($scope.ciphertext_2, 1))
          err.push("c_err_2");
      }
      return err;
    }
    $scope.show_errors = function(err){
      for(var i=0;i<err.length;i++){
        if(err[i] == "key_err_1")
          $scope.key_err_1 = 1;
        else if(err[i] == "key_err_2")
          $scope.key_err_2 = 1;
        else if(err[i] == "p_c_err_1")
          $scope.p_c_err_1 = 1;
        else if(err[i] == "p_c_err_2")
          $scope.p_c_err_2 = 1;
        else if(err[i] == "p_err_1")
          $scope.p_err_1 = 1;
        else if(err[i] == "p_err_2")
          $scope.p_err_2 = 1;
        else if(err[i] == "c_err_1")
          $scope.c_err_1 = 1;
        else if(err[i] == "c_err_2")
          $scope.c_err_2 = 1;
      }
    }
    $scope.form_submit = function(){
      var err = $scope.form_validate();
      if(err.length == 0){
        $scope.remove_errors();
        if($scope.key_1.length==16){
          $scope.process_key_1();
          if($scope.plaintext_1.length>0){
            $scope.ciphertext_1 = $scope.encrypt($scope.plaintext_1, 1);
          }else{
            $scope.plaintext_1 = $scope.decrypt($scope.ciphertext_1, 1);
          }
        }
        if($scope.key_2.length==16){
          $scope.process_key_2();
          if($scope.plaintext_2.length>0){
            $scope.ciphertext_2 = $scope.encrypt($scope.plaintext_2, 2);
          }else{
            $scope.plaintext_2 = $scope.decrypt($scope.ciphertext_2, 2);
          }
        }
        if($scope.key_1.length>0 && $scope.key_2.length>0){
          $scope.analysis();
          $scope.show_analysis = 1;
        }else
          $scope.show_analysis = 0;
      }else
        $scope.show_errors(err);
    }
});

app.config(['$routeProvider',function ($routeProvider){
    $routeProvider
        .when('/',{
            title: 'home',
            templateUrl: 'templates/home.html'
        })
        .when('/PA0',{
            title: 'PA0',
            templateUrl: 'templates/PA0.html'
        })
        .when('/PA1',{
            title: 'PA1',
            templateUrl: 'templates/PA1.html'
        })
        .when('/PA2',{
            title: 'PA2',
            templateUrl: 'templates/PA2.html'
        })
        .otherwise({
            redirectTo: 'templates/notfound.html'
        });
}]);

app.directive('chart', function (){
    return {
        restrict:'E',
        template:'<div></div>',
        transclude:true,
        replace:true,
        scope: '=',
        link:function (scope, element, attrs) {
            var opt = {
                chart:{
                    renderTo:element[0],
                    type:'line',
                    marginRight:130,
                    marginBottom:40
                },
                title:{
                    text:attrs.title,
                    x:-20 //center
                },
                subtitle:{
                    text:attrs.subtitle,
                    x:-20
                },
                xAxis:{
                    tickInterval:1,
                    title:{
                        text:attrs.xname
                    }
                },
                plotOptions:{
                    lineWidth:0.5
                },
                yAxis:{
                    title:{
                        text:attrs.yname
                    },
                    tickInterval:(attrs.yinterval)?new Number(attrs.yinterval):null,
                    max:attrs.ymax,
                    min: attrs.ymin
                },
                tooltip:{
                    formatter:scope[attrs.formatter]||function () {
                        return '<b>' + this.y + '</b>'
                    }
                },
                legend:{
                    layout:'vertical',
                    align:'right',
                    verticalAlign:'top',
                    x:-10,
                    y:100,
                    borderWidth:0
                },
            }
            scope.$watch(function (scope) {
                return JSON.stringify({
                    xAxis:{
                        categories:scope[attrs.xdata]
                        },
                    series:scope[attrs.ydata]
                });
            }, function (news) {
                news = JSON.parse(news)
                if (!news.series)return;
                angular.extend(opt,news);
                var chart = new Highcharts.Chart(opt);
            });
        }
    }
})