	(function( $ ) {

		increases = [
			{fwef:"01-07-2010",
			 frate:"15%",
			 fauthority:"",
			 fauthorityLink:"",
			 fto:"",
			 fdiscontinueAuthority:"",
			 fdiscontinueAuthorityLink:"",
			 pwef: "01-07-2010",
	  	     prate:"15%",
	  	     pauthority:"",
	  	     pauthorityLink:"",
	  	     pto:"",
	  	     pdiscontinueAuthority:"",
	  	     pdiscontinueAuthorityLink:""
			},

			{fwef:"01-07-2011",
			 frate:"15%",
			 fauthority:"",
			 fauthorityLink:"",
			 fto:"",
			 fdiscontinueAuthority:"",
			 fdiscontinueAuthorityLink:"",
			 pwef: "01-07-2011",
	  	     prate:"15%",
	  	     pauthority:"",
	  	     pauthorityLink:"",
	  	     pto:"",
	  	     pdiscontinueAuthority:"",
	  	     pdiscontinueAuthorityLink:""
			},

			{fwef:"01-07-2012",
			 frate:"20%",
			 fauthority:"",
			 fauthorityLink:"",
			 fto:"01-07-2015",
			 fdiscontinueAuthority:"",
			 fdiscontinueAuthorityLink:"",
			 pwef: "01-07-2012",
	  	     prate:"20%",
	  	     pauthority:"",
	  	     pauthorityLink:"",
	  	     pto:"01-07-2015",
	  	     pdiscontinueAuthority:"",
	  	     pdiscontinueAuthorityLink:""
			},

			{fwef:"01-07-2013",
			 frate:"10%",
			 fauthority:"",
			 fauthorityLink:"",
			 fto:"01-07-2016",
			 fdiscontinueAuthority:"",
			 fdiscontinueAuthorityLink:"",
			 pwef: "01-07-2013",
	  	     prate:"15%",
	  	     pauthority:"",
	  	     pauthorityLink:"",
	  	     pto:"01-07-2016",
	  	     pdiscontinueAuthority:"",
	  	     pdiscontinueAuthorityLink:""
			},

			{fwef:"01-07-2014",
			 frate:"10%",
			 fauthority:"",
			 fauthorityLink:"",
			 fto:"01-07-2016",
			 fdiscontinueAuthority:"",
			 fdiscontinueAuthorityLink:"",
			 pwef: "01-07-2014",
	  	     prate:"10%",
	  	     pauthority:"",
	  	     pauthorityLink:"",
	  	     pto:"01-07-2016",
	  	     pdiscontinueAuthority:"",
	  	     pdiscontinueAuthorityLink:""
			},

			{fwef:"01-07-2015",
			 frate:"7.5%",
			 fauthority:"",
			 fauthorityLink:"",
			 fto:"",
			 fdiscontinueAuthority:"",
			 fdiscontinueAuthorityLink:"",
			 pwef: "01-07-2015",
	  	     prate:"10%",
	  	     pauthority:"",
	  	     pauthorityLink:"",
	  	     pto:"",
	  	     pdiscontinueAuthority:"",
	  	     pdiscontinueAuthorityLink:""
			},

			{fwef:"01-07-2016",
			 frate:"10%",
			 fauthority:"",
			 fauthorityLink:"",
			 fto:"",
			 fdiscontinueAuthority:"",
			 fdiscontinueAuthorityLink:"",
			 pwef: "01-07-2016",
	  	     prate:"10%",
	  	     pauthority:"",
	  	     pauthorityLink:"",
	  	     pto:"",
	  	     pdiscontinueAuthority:"",
	  	     pdiscontinueAuthorityLink:""
			}
		];

		$.fn.format= function(num) {
			var re = '\\d(?=(\\d{' + (3 || 3) + '})+' + (2 > 0 ? '\\D' : '$') + ')',
			num = parseFloat(num).toFixed(2);

			return ('.' ? num.replace('.', '.') : num).replace(new RegExp(re, 'g'), '$&' + (',' || ','));
		}

		$.fn.trimNum = function(num, places, rounding) {
			rounding = rounding || "round";
			var num = parseFloat(num), multiplier = Math.pow(10, places);
			return(Number(Math[rounding](num * multiplier) / multiplier));
		}

		$.fn.dob = function(dob) { // 1980-05-04
			var dobday = dob.substring(8);
			var dobmonth = dob.substring(5,7);
			var dobyear = dob.substring(0,4);

			this.text(dobyear + " - "  + dobmonth +  " - "  + dobday);
			return dobyear + " - " + dobmonth + " - " + dobday;
		}

		$.fn.dor = function(dor) {
			var dorday = dor.substring(8);
			var dormonth = dor.substring(5,7);
			var doryear = dor.substring(0,4);

			this.text(doryear + " - " + dormonth + " - " + dorday);
			return Array(doryear, dormonth, dorday);
		}

		$.fn.doa = function(doa) {
			var doaday = doa.substring(8);
			var doamonth = doa.substring(5,7);
			var doayear = doa.substring(0,4);

			this.text(doayear + " - " + doamonth + " - " + doaday);
			return doayear + " - " + doamonth + " - " + doaday;
		}

		$.fn.dod = function(dod) {
			var dodday = dod.substring(8);
			var dodmonth = dod.substring(5,7);
			var dodyear = dod.substring(0,4);

			this.text(dodyear + " - " + dodmonth + " - " + dodday);
			return dodyear + " - " + dodmonth + " - " + dodday;
		}

		$.fn.age = function(dob, dor){
			var dobday = Number(dob.substring(8));
			var dobmonth = Number(dob.substring(5,7));
			var dobyear = Number(dob.substring(0,4));

			var dorday = Number(dor.substring(8));
			var dormonth = Number(dor.substring(5,7));
			var doryear = Number(dor.substring(0,4));
			//alert(dob + ":" + dobday + ":" + dobmonth + ":" + dobyear + ":" + dor +":"+ dorday + ":" + dormonth + ":" + doryear);
			// if day of birth is greater than day of retirement

			if (dobday > dorday)
			{
				dorday += 30;
				dormonth--;
			}


			// if month of birth is greater than month of retirement

			if (dobmonth > dormonth)
			{
				dormonth += 12;
				doryear--;
			}

			var d, m, y;

			d = dorday - dobday;
			m = dormonth - dobmonth;
			y = doryear - dobyear;

			this.text(y + " y" + (m>0 ? ", " + m + " m" : "") + (d>0 ? ", " + d + " d": ""));
			//var rage = new
			return Array(y, m, d);
		}

		$.fn.lservice = function(doa, dor){
			var doaday = Number(doa.substring(8));
			var doamonth = Number(doa.substring(5,7));
			var doayear = Number(doa.substring(0,4));

			var dorday = Number(dor.substring(8));
			var dormonth = Number(dor.substring(5,7));
			var doryear = Number(dor.substring(0,4));

			var qy, qm, qd, qs;


			// Check if day of appointment is greater than retirement day

			if ( doaday > dorday )
			{
			   dorday += 30;
			   dormonth--;
			}


			// Check if month of retirement is less than appointment month

			if ( dormonth < doamonth )
			{
			   dormonth += 12;
			   doryear--;
			}


			qd = dorday - doaday;
			qm = dormonth - doamonth;
			qy = doryear - doayear;


			// If Qualifying Days are exceeding 30 days

			if (qd > 30)
			{
				qd -= 30;
				qm++;
			}

			// if Qualifying months are more than 5

			if (qm > 12)
			{
				qm -= 12;
				qy++;
			}

			this.text(qy + " y" + (qm>0 ? ", " + qm + " m" : "") + (qd>0 ? ", " + qd + " d" : ""));
			return Array( qy, qm, qd );
		}

		$.fn.qservice = function(doa, dor){
			var doaday = Number(doa.substring(8));
			var doamonth = Number(doa.substring(5,7));
			var doayear = Number(doa.substring(0,4));

			var dorday = Number(dor.substring(8));
			var dormonth = Number(dor.substring(5,7));
			var doryear = Number(dor.substring(0,4));

			var qy, qm, qd, qs;


			// Check if day of appointment is greater than retirement day

			if ( doaday > dorday )
			{
			   dorday += 30;
			   dormonth--;
			}


			// Check if month of retirement is less than appointment month

			if ( dormonth < doamonth )
			{
			   dormonth += 12;
			   doryear--;
			}


			qd = dorday - doaday;
			qm = dormonth - doamonth;
			qy = doryear - doayear;


			// If Qualifying Days are exceeding 30 days

			if (qd > 30)
			{
			   qm++;
			}

			// if Qualifying months are more than 5

			if (qm > 5)
			{
			  qy++;
			}

			this.text( (qy > 30 ? 30 : qy) + " years");
			return ( qy > 30 ? 30 : qy );
		}

		$.fn.inc = function(dor, bps) {
			var scale2011_inc = new Array(
					 150,
					 170,
					 200,
					 230,
					 260,
					 290,
					 320,
					 350,
					 380,
					 420,
					 460,
					 500,
					 550,
					 610,
					 700,
					 800,
					1200,
					1500,
					1600,
					2350,
					2600,
					3050);

			var scale2015_inc = new Array(
					 195,
					 220,
					 260,
					 300,
					 340,
					 375,
					 415,
					 455,
					 495,
					 544,
					 595,
					 650,
					 715,
					 790,
					 905,
					1035,
					1555,
					1950,
					2075,
					3050,
					3375,
					3960);

			var scale2016_inc = new Array(
					 240,
					 275,
					 325,
					 370,
					 420,
					 470,
					 510,
					 560,
					 610,
					 670,
					 740,
					 800,
					 880,
					 980,
					1120,
					1280,
					1930,
					2400,
					2560,
					3750,
					4150,
					4870);

			var scale2017_inc = new Array(
					 290,
					 330,
					 390,
					 440,
					 500,
					 560,
					 610,
					 670,
					 730,
					 800,
					 880,
					 960,
					1050,
					1170,
					1330,
					1520,
					2300,
					2870,
					3050,
					4510,
					5000,
					5870);

			var scale2022_inc = new Array(
					 430,
					 490,
					 580,
					 660,
					 750,
					 840,
					 910,
					1000,
					1090,
					1190,
					1310,
					1430,
					1560,
					1740,
					1980,
					2260,
					3420,
					4260,
					4530,
					6690,
					7420,
					8710);

			var rday = Number(dor.substring(8));
			var rmonth = Number(dor.substring(5,7));

			var June302011 = new Date('2011-06-30');
			var June302015 = new Date('2015-06-30');
			var June302016 = new Date('2016-06-30');
			var June302017 = new Date('2017-06-30');
			var June302022 = new Date('2022-06-30');

			var dorr = new Date(dor.substring(0,4) + '-' + dor.substring(5,7) + '-' + dor.substring(8));

			if ((rmonth<6) || (rmonth == 12)) return 0;

			if (rmonth > 5 && rmonth < 12)
			{
			    if ( dorr > June302011 && dorr <= June302015) {
					return Number(scale2011_inc[bps-1]);
				} else if ( dorr > June302015 && dorr <= June302016) {
					return Number(scale2015_inc[bps-1]);
				} else if  (dorr > June302016 && dorr <= June302017) {
					return Number(scale2016_inc[bps-1]);
				} else if  (dorr > June302017 && dorr <= June302022) {
					return Number(scale2017_inc[bps-1]);
				} else if  (dorr > June302022) {
					return Number(scale2022_inc[bps-1]);
				}
			}

			return 0;
		}

		$.fn.commtt = function(age) {
			var commtt_table = new Array(
				486.0156,
				476.8092,
				467.5836,
				458.3688,
				449.1648,
				439.9812,
				430.8072,
				421.6464,
				412.5000,
				403.3716,
				393.6853,
				385.1688,
				376.0944,
				367.0428,
				358.0116,
				349.0092,
				340.0344,
				331.0896,
				322.1784,
				313.2108,
				304.4736,
				295.6872,
				286.9512,
				278.2080,
				269.6556,
				261.1104,
				252.6456,
				244.2660,
				235.9836,
				227.8092,
				219.7548,
				211.8312,
				204.0600,
				196.4520,
				189.0204,
				181.7736,
				174.7224,
				167.8656,
				161.2080,
				154.7436,
				148.4628,
				142.3584,
				136.4208,
				130.6464,
				125.0280,
				119.6316,
				114.2568,
				109.6968,
				104.0904,
				 99.2364,
				 94.5336,
				 89.9796);
			this.text((age < 60 ? commtt_table[((age+1)-20)] : commtt_table[(age-20)]));
			return (age < 60 ? commtt_table[((age+1)-20)] : commtt_table[(age-20)]);
		}
		// Compares two dates
		// if d1 and d2 are same returns 0
		// if d1 is greater than d2 returns 1
		// if d1 is less than d2 returns -1
		$.fn.compareDates = function(d1, d2) {
			d1 = d1.split("-");
			d2 = d2.split("-");

			// if Year of d1 is greater than year of d2 return 1
			if (Number(d1[0]) > Number(d2[0])) return 1;

			// if year of d1 is less than year of d2 return -1
			if (Number(d1[0]) < Number(d2[0])) return -1;

			// if years of both dates are same
			if (Number(d1[0]) == Number(d2[0])) {

				// if month of d1 is greater than month of d2 return 1
				if (Number(d1[1]) > Number(d2[1])) return 1;

				// if month of d1 is less than month of d2 return -1
				if (Number(d1[1]) < Number(d2[1])) return -1;

				// if months of both dates are same
				if (Number(d1[1]) == Number(d2[1])) {

					// if day of d1 is greater than day of d2 return 1
					if (Number(d1[2]) > Number(d2[2])) return 1;

					// if day of d1 is less than day of d2 return -1
					if (Number(d1[2]) < Number(d2[2])) return -1;

					// if days of both dates are same return 0
					if (Number(d1[2]) == Number(d2[2])) return 0;
				}
			}
		}

		$.fn.pincreases = function(npen) {
			var result = [];
			var rtotal;
			for (i = 0; i < increases.length; i++) {
				result = npen ;
			}
		}

		$.fn.checkPay = function(pay,scale,dor) {
			var scales = [
						{'wef':"2022-07-01",
						 'pay':[[13550, 430, 26450],[13820, 490, 28520],[14260, 580, 31660],[14690, 660, 34490],
								[15230, 750, 37730],[15760, 840, 40960],[16310, 910, 43610],[16890,1000, 46890],
								[17470,1090, 50170],[18050,1190, 53750],[18650,1310, 57950],[19770,1430, 62670],
								[21160,1560, 67960],[22530,1740, 74730],[23920,1980, 83320],[28070,2260, 95870],
								[45070,3420,113470],[56880,4260,142080],[87840,4530,178440],[102470,6690,196130],
								[113790,7420,217670],[122190,8710,244130]]
						},
						{'wef':"2017-07-01",
						 'pay':[[ 9130, 290, 17830],[ 9310, 330, 19210],[ 9610, 390, 21310],[ 9900, 440, 23100],
								[10260, 500, 25260],[10620, 560, 27420],[10990, 610, 29290],[11380, 670, 31480],
								[11770, 730, 33670],[12160, 800, 36160],[12570, 880, 38970],[13320, 960, 42120],
								[14260,1050, 45760],[15180,1170, 50280],[16120,1330, 56020],[18910,1520, 64510],
								[30370,2300, 76370],[38350,2870, 95750],[59210,3050,120210],[69090,4510,132230],
								[76720,5000,146720],[82380,5870,164560]]
						},
						{'wef':"2016-07-01",
						 'pay':[[ 7640, 240, 14840],[ 7790, 275, 16040],[ 8040, 325, 17790],[ 8280, 370, 19380],
								[ 8590, 420, 21190],[ 8900, 470, 23000],[ 9220, 510, 24520],[ 9540, 560, 26340],
								[ 9860, 610, 28160],[10180, 670, 30280],[10510, 740, 32710],[11140, 800, 35140],
								[11930, 880, 38330],[12720, 980, 42120],[13510,1120, 47110],[15880,1280, 54280],
								[25440,1930, 64040],[31890,2400, 79890],[49370,2560,100570],[57410,3750,109910],
								[63780,4150,121880],[68540,4870,136720]]
						},

						{'wef':"2015-07-01",
						 'pay':[[ 6210, 195,12060],[ 6335, 220,12935],[ 6535, 260,14335],[ 6730, 300,15730],
								[ 6985, 340,17185],[ 7235, 375,18485],[ 7490, 415,19940],[ 7750, 455,21400],
								[ 8015, 495,22865],[ 8275, 544,24595],[ 8540, 595,26390],[ 9055, 650,28555],
								[ 9700, 715,31150],[10340, 790,34040],[10985, 905,38135],[12910,1035,43960],
								[20680,1555,51780],[25940,1950,64940],[40155,2075,81655],[46705,3050,89405],
								[51885,3375,99135],[55755,3960,111195]]
						},

						{'wef':"2011-07-01",
						 'pay':[[ 4800, 150, 9300],[ 4900, 170,10000],[ 5050, 200,11050],[ 5200, 230,12100],
								[ 5400, 260,13200],[ 5600, 290,14300],[ 5800, 320,15400],[ 6000, 350,16500],
								[ 6200, 380,17600],[ 6400, 420,19000],[ 6600, 460,20400],[ 7000, 500,22000],
								[ 7500, 550,24000],[ 8000, 610,26300],[ 8500, 700,29500],[10000, 800,34000],
								[16000,1200,40000],[20000,1500,50000],[31000,1600,63000],[36000,2350,68900],
								[40000,2600,76400],[43000,3050,85700]]
						},

						{'wef':"2008-07-01",
						 'pay':[[ 2970,  90, 5670],[ 3035, 100, 6035],[ 3140,120, 6740],[ 3240, 140, 7440],
								[ 3340, 160, 8140],[ 3430, 175, 8680],[ 3530,190, 9230],[ 3665, 210, 9965],
								[ 3820, 230,10720],[ 3955, 260,11755],[ 4115,275,12365],[ 4355, 310,13655],
								[ 4645, 340,14845],[ 4920, 380,16320],[ 5220,420,17820],[ 6060, 470,20160],
								[ 9850, 740,24650],[12910, 930,31510],[19680,970,39080],[23345,1510,44485],
								[25880,1700,49680],[27680,1985,55470]]
						},

						{'wef':"2007-07-01",
						 'pay':[[ 2475,  75, 4725],[ 2530,  85, 5080],[ 2615,100, 5615],[ 2700, 115, 6150],
								[ 2780, 135, 6830],[ 2860, 145, 7210],[ 2940,160, 7740],[ 3055, 175, 8305],
								[ 3185, 190, 8885],[ 3295, 215, 9745],[ 3430,230,10330],[ 3630, 260,11430],
								[ 3870, 285,12420],[ 4100, 315,13550],[ 4350,350,14850],[ 5050, 390,16750],
								[ 8210, 615,20510],[10760, 775,26260],[16400,810,32600],[19455,1260,37095],
								[21565,1415,41375],[23065,1655,46235]]
						},

						{'wef':"2005-07-01",
						 'pay':[[ 2150,  65, 4100],[ 2200,  75, 4450],[ 2275, 85, 4825],[ 2345, 100, 5345],
								[ 2415, 115, 5865],[ 2485, 125, 6235],[ 2555,140, 6755],[ 2655, 150, 7155],
								[ 2770, 165, 7720],[ 2865, 185, 8415],[ 2980,200, 8980],[ 3155, 225, 9905],
								[ 3365, 245,10715],[ 3565, 275,11815],[ 3780,305,12930],[ 4375, 340,14575],
								[ 7140, 535,17840],[ 9355, 675,22855],[14260,705,28360],[16915,1095,32245],
								[18750,1230,35970],[20055,1440,40215]]
						},

						{'wef':"2001-07-01",
						 'pay':[[ 1870,  55, 3520],[ 1915,  65, 3865],[ 1980, 75, 4230],[ 2040, 85, 4590],
						  		[ 2100, 100, 5100],[ 2160, 110, 5460],[ 2220,120, 5820],[ 2310,130, 6210],
						  		[ 2410, 145, 6760],[ 2490, 160, 7290],[ 2590,175, 7840],[ 2745,195, 8595],
						  		[ 2925, 215, 9375],[ 3100, 240,10300],[ 3285,265,11235],[ 3805,295,12655],
						  		[ 6210, 465,15510],[ 8135, 585,19835],[12400,615,24700],[14710,950,28010],
						  		[16305,1070,31285],[17440,1250,34940]]
						}];
			for (var i = 0; i < scales.length; i++){
				if ($.fn.compareDates(dor, scales[i].wef) >= 0) {
					return ((pay - scales[i].pay[scale-1][0]) ? ((pay - scales[i].pay[scale-1][0]) % scales[i].pay[scale-1][1]) : false)
					break;
				}
			};
		}

	}( jQuery ));
