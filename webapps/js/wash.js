
//var request = require('request');
var user_list = [];
var userTable = null;
var wash_details  = 1000;
var WASH_DEVICE_LINK_REC = 10201;
var wash_list = [];
$(document).ready(function () {
    $(".leftMenu").removeClass('active')
    $(".records").addClass('active')
    loadorgmanagementList();
    addRowHandlers();

});

function addRowHandlers() {
    var table = document.getElementById("orgmanagement1");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = 
            function(row) 
            {
                return function() { 
                                        var cell = row.getElementsByTagName("td")[0];
                                        var id = cell.innerHTML;
                                        alert("id:" + id);
                                 };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}


function loadorgmanagementList() {


    if (userTable) {
        userTable.destroy();
        $("#orgmanagement1").html("");
    }

    var fields = [
        {
            mData: 'project_name',
            sTitle: 'Project Name',
            orderable: false,
            mRender: function (data, type, row) {
                return data ? data : "-";

            }

        },
        {
            mData: 'project_description',
            sTitle: 'Project Description',
            mRender: function (data, type, row) {
                return data ? data : "-";

            }
        },
        {
            mData: 'status',
            sTitle: 'Status',
            orderable: false,
            mRender: function (data, type, row) {

                return data ? data : "-";
                
            }
        },
        {
            mData: 'developer',
            sTitle: 'Linked Developers',
            orderable: false,
            mRender: function (data, type, row) {
                var str = '<a href="javascript:void(0)" class="btn btn-xs btn-default" onclick="openModal1(4,\'' + row['_id'] + '\')">' +
                    '<i class="fa fa-eye"></i> <span style="font-weight: 600;">Click Here<span></a>';
                return str;
            }
        },
        {
            mData: 'sdate',
            sTitle: 'Start Date',
            orderable: false,
            mRender: function (data, type, row) {

                return moment(data).format('MM/DD/YYYY hh:mm a')

            }
        },
        {
            mData: 'edate',
            sTitle: 'End Date',
            orderable: false,
            mRender: function (data, type, row) {

                return moment(data).format('MM/DD/YYYY hh:mm a')

            }
        },
        {
            mData: 'actual_sdate',
            sTitle: 'Actual Start Date',
            orderable: false,
            mRender: function (data, type, row) {

                return moment(data).format('MM/DD/YYYY hh:mm a')

            }
        },
        {
            mData: 'actual_edate',
            sTitle: 'Actual End Date',
            orderable: false,
            mRender: function (data, type, row) {

                return moment(data).format('MM/DD/YYYY hh:mm a')

            }
        },
        {
            mData: 'action',
            sTitle: 'Action',
            orderable: false,
            mRender: function (data, type, row) {

                  var r = '<span>'+'<a class="" style="cursor:pointer;color:#007bff;" href="#" onclick="edit(' + '\'' + row["_id"] + '\'' + ', ' + '\'' + row['washname'] + '\'' + ',' + '\'' + row['status'] + '\'' + ',' + '\'' + row['washtype'] + '\'' + ')"><i class="fa fa-edit"></i></a>' +
                    '<a class="" href="#" style="margin-left: 15px;color:red;cursor:pointer" onclick="del(' + '\'' + row["_id"] + '\'' + ', ' + '\'' + row['washid'] + '\'' + ')"><i class="fa fa-trash"></i></a>'+
                    '<a class="" href="#" style="margin-left: 15px;color:gray;cursor:pointer;" onclick="washingDetails()"><i  class="fa fa-power-off"></i></a>'+'</span>'
                   



                return data ? data : r;

            }
        },

    ];

var tableOption = {
        fixedHeader: {
            header: true,
            headerOffset: -5
        },
        responsive: true,
        paging: true,
        searching: true,
        "ordering": true,
        iDisplayLength: 10,
        lengthMenu: [[10, 50, 100], [10, 50, 100]],
        aoColumns: fields,
        data: []
    };
 var queryParams = {
        "query": {
            "bool": {
                "must": [{
                    match: { domainKey: DOMAIN_KEY }
                }
                ]
            }
        },
        "size": 1000,
        sort: {

        }
    };
 var searchQuery = {
        "method": 'GET',
        "extraPath": "",
        "query": JSON.stringify(queryParams),
        "params": []
    };
    console.log(searchQuery);
    searchByQuery(wash_details, 'RECORD', searchQuery, function (status, data) {
        if (status) {
            console.log(data);
            var resultData = searchQueryFormatter(data).data;
            console.log(resultData);
            var totalRecords = resultData.recordsTotal;
          console.log(totalRecords)
            var resData = resultData['data'];
            wash_list = resData;
            console.log(resData);
            tableOption['data'] = resData;



            $(".projectCount").html(totalRecords);


        } else {
        }
        userTable = $("#orgmanagement1").DataTable(tableOption);
    });
}



function searchQueryFormatter(data) {

    var resultObj = {
        total: 0,
        data: {},
        aggregations: {}
    }

    if (data.httpCode === 200) {

        var arrayData = JSON.parse(data.result);

        var totalRecords = arrayData.hits.total;
        var records = arrayData.hits.hits;

        var aggregations = arrayData.aggregations ? arrayData.aggregations : {};


        for (var i = 0; i < records.length; i++) {
            records[i]['_source']['_id'] = records[i]['_id'];
        }

        resultObj = {
            "total": totalRecords,
            "data": {
                "recordsTotal": totalRecords,
                "recordsFiltered": totalRecords,
                "data": _.pluck(records, '_source')
            },
            aggregations: aggregations
            // data : _.pluck(records, '_source')
        }

        $(".eventCount").html(totalRecords)


        return resultObj;

    } else {

        return resultObj;

    }

}

function openModal() {
    $("#Adddetails form")[0].reset();
    $("#Adddetails").modal('show');
    $("#Adddetails form").attr('onsubmit', 'adddetails()');

}

function openModal1(type, id) {
   
    current_wash_id = id;
    console.log(current_wash_id);
        deviceObj = {};
        linked_list = [];
        console.log(wash_list)
        for (var i = 0; i < wash_list.length; i++) {
            if (id === wash_list[i]._id) {
                linked_list = wash_list[i];
            }
        }
        console.log(current_wash_id)
       $("#deviceID").val('')
       loadDeviceList();
       // loadLinkedDevices();
       $(".tankName").html(linked_list.washname)
       $("#linkModal").modal('show');

}

function loadDeviceList(searchText) {

    var domainKeyJson = {"match": {"domainKey": DOMAIN_KEY}};

    var queryParams = {
        "query": {
            "bool": {
                "must": []
            }
        },
        "size": 25,
        "sort": [{"reportedStamp": {"order": "desc"}}]
    };

    if (searchText) {
        var searchJson = {
            "multi_match": {
                "query": '*' + searchText + '*',
                "type": "phrase_prefix",
                "fields": ['_all']
            }
        };
        queryParams.query['bool']['must'] = [domainKeyJson, searchJson];

    } else {
        queryParams.query['bool']['must'] = [domainKeyJson];
    }


    var searchQuery = {
        "method": 'GET',
        "extraPath": "",
        "query": JSON.stringify(queryParams),
        "params": []
    };

    $(".deviceListUl").html('');

    searchDevice(searchQuery, function (status, res) {
        if (status) {

            var resultData = searchQueryFormatter(res).data;
            device_list = resultData['data'];
            console.log(device_list);
            for (var i = 0; i < device_list.length; i++) {
                $(".deviceListUl").append('<li class="deviceListLi" onclick="setDeviceId(\'' + device_list[i].id + '\')">' +
                    (device_list[i].name ? device_list[i].name : device_list[i].id) + ' | ' + device_list[i].modelId + ' | <b>' +
                    device_list[i].version +
                    '</b></li>');
            }
        } else {
            device_list = []
        }


    })


}

function setDeviceId(id) {
    for (var i = 0; i < device_list.length; i++) {
        if (id === device_list[i].id) {
            deviceObj = device_list[i];
        }
    }

    $("#deviceID").val(id)
}

function linkDevice() {

console.log(current_wash_id);
    var linkObj = {
        washid: current_wash_id,
        did: deviceObj.id,
        dmid: deviceObj.modelId,
        version: deviceObj.version,
        createdtime: new Date().getTime()
    };
    console.log(linkObj);
    console.log(deviceObj.id);
   

                    updateRecord(WASH_DEVICE_LINK_REC, deviceObj.id, linkObj, function (status, data) {
                        if (status) {
                            successMsg('Device Linked Successfully');
                            $("#deviceID").val('')
                            //loadLinkedDevices();
                        } else {
                            errorMsg('Error in Linking')
                        }
                        $(".btnSubmit").removeAttr('disabled');

                    })
                
}

function adddetails() {

   
    var on = $("#wash_name").val();
    //var od = $("#wash_power").val();
    var oa = $("#wash_type").val();
   
    
    //bool_value = od == "true" ? true : false;
    var details = {
       
        washname: on,
        status: "OFF",
        washtype: oa,
        createtime: new Date().getTime()
    }
    console.log(details);
    //var recordId = 10000;
    insertRecord(wash_details, details, function (status, data) {
        if (status) {
            successMsg('Record Created Successfully');
            $("#Adddetails").modal('hide');
            loadorgmanagementList();

        } else {
            errorMsg('Error in Creating Record')
            console.log(data)
        }

    })
   
}

function edit(i, b, c, d) {
   
   
    var uoffice = document.getElementById("edit_name");
               uoffice.setAttribute("value", b);
   var uschool = document.getElementById("edit_status");
               uschool.setAttribute("value", c);
    var ucollage = document.getElementById("edit_wtype");
               ucollage.setAttribute("value", d);
   
                                   
    $("#Editdetails form")[0].reset();


    $("#Editdetails").modal('show');
    $("#organization_edit").click(function () {
       
        var g = $("#edit_name").val();
        var h = $("#edit_status").val();
        var j = $("#edit_wtype").val();
       
        

       
        var office;
        var school;
        var collage;
      

       
        if (g != "") {
            office = g;
        }
        else {
            office = b;
        }
        if (h != "") {
            school = h;
        }
        else {
            school = c;
        }


        if (j != "") {
            collage = j;
        }
        else {
            collage = d;
        }
        
        var obj = {

            
            'washname': office,
            'status': school,
            'washtype': collage,
            'createtime': new Date().getTime(),
        }

        console.log(obj);
        console.log(i);
        updateRecords(wash_details,i, obj,function( status, data){
            if(status){
             successMsg('Record Updated Successfully');
              $("#Editdetails").modal('hide');
              loadorgmanagementList();
            }
            else{
                errorMsg('Error in Updated Record')
            }
        } )
          



    })

}


function updateRecords(rid, rkey, obj, cbk){
    $.ajax({
        url: API_BASE_PATH + "/record/insert/static/" + API_TOKEN + '/' + rid + '/' + rkey,
        data: JSON.stringify(obj),
        contentType: "text/plain",
        type: 'POST',
        success: function (data) {
            cbk(true,data)
        },
        error: function (e) {
            cbk(false,e)
        }
       
    });
}


function del(id, org) {
   console.log(org);
   console.log(id);
    deleteRecord(wash_details, id, function (status, data) {
        
        
        if (status) {
            
          
            //del_second(org);
            //del_char(org);
            successMsg('All Record Deleted Successfully');
            loadorgmanagementList();
            
        }
    })
       tableOption['data']=resData;

}

function washingDetails(){

   console.log("enter on/off status");

var DOMAIN_KEY = 'WTFNQTRTDN';
var API_KEY = 'N9Swf6hgEfMO';
var API_URL = 'https://api.boodskap.io';




   
    var dmid = 'BDSKP';
    var version = '1.0.0';
    var mid = 10010;

    
    var did = 'WM-BDSKP-001';

    var urlString = API_URL+'/push/raw/'+DOMAIN_KEY+'/'+API_KEY+'/'+did+'/'+dmid+'/'+version+'/'+mid+'?type=JSON';

    

    var payload = {
        "lint": 25,
        "power": true,
        "stage": "wash"
    };

   

    urlPost(did,urlString,mid,payload)
}


function urlPost(did,url, mid, data) {
    console.log(url);
    console.log(data);
    $.ajax({
        url: url,
        data: JSON.stringify(data),
        contentType: "text/plain",
        type: 'POST',
        success: function (err, res, body) {
            if(res.statusCode === 200){
                console.log(new Date() + " | ["+did+"] ["+mid+"] ["+JSON.stringify(res.body)+"] Message Posted successfully");
                loadorgmanagementList();
            }else{
                console.log(new Date() + " |["+did+"] ["+mid+"] ["+res.statusCode+"] Error in posting data =>",res.body);
                loadorgmanagementList();
            }

           // cbk(true);
        },
        error: function (e) {
            //cbk(false);
        }
    });

}