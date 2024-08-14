


import datetime
from math import e
from pprint import pprint
import random
from flask import Flask, jsonify, render_template, request,redirect,url_for
from flask_cors import CORS
import Database
# from import  Database
from Database.tables import data_init
from ciscoaxl import axl
from zeep.exceptions import Fault
from CucRest import CUC
from xmldict import xml_dict

import uuid

cucm = '10.64.184.100'
username = 'axlUser23'
password = 'Basf.cmd'
version = '12.5'
cuc="10.10.20.18"
user="administrator"
passw="ciscopsdt"


app=Flask(__name__)
cors=CORS(app,resources={r'*':{'origins':'*'}})

ucm = axl(username=username,password=password,cucm=cucm,cucm_version=version)
cuc=CUC(cuc=cuc,username=user,password=passw,)
db=data_init(app=app)



@app.route('/api',methods=['GET','POST'])
def index():
    request_method=request.method
    if request.method=='POST':
        userId=request.form
        print(request.form)
        return redirect(url_for(name))
    return render_template('index.html',saif=request_method)

    
@app.route("/CheckPartition",methods=['GET',"POST"])
def checkPartition():
    Initial=[]
    VMt=[]
    getPs=ucm.get_partitions()
    getVMts=cuc.Get_Templates()
    pprint(getVMts["UserTemplate"])
    if type(getVMts["UserTemplate"])==dict:
        VMt.append(getVMts["UserTemplate"]["Alias"])
    if type(getVMts["UserTemplate"])==list:
        for temp in getVMts["UserTemplate"]:
            VMt.append(temp["Alias"])

    print("getPs",getPs)
    for pa in getPs:
        print(pa["name"])
        Initial.append(pa["name"])
    return jsonify({"data":{"partitions":Initial,"VMTemplates":VMt}})

@app.route('/checkUserState',methods=['GET',"POST"])
def name():
    data=request.json
    # ucm = axl(username=username,password=password,cucm=cucm,cucm_version=version)
    
    UserFind=ucm.get_user(userid=f'{data["UserId"]}')
    UserDevicesFind=ucm.list_route_plan(pattern="1")
    print(UserDevicesFind)
   
    if(str(UserFind)=="Item not valid: The specified User was not found"):
        return jsonify(fault="notFound")
    else:
        return jsonify({"data":{"UserId":str(UserFind['userid']),"firstName":str(UserFind['firstName']),"lastName":str(UserFind['lastName']),"mailid":str(UserFind['mailid'])}})
   


@app.route('/AddUser',methods=['GET',"POST"])
def AddUser():
    error=[]
    data=request.json
    csfName=data["UserId"]
    id=uuid.uuid4().hex
    date=datetime.datetime.now().strftime("%x %X")
    csd=str(csfName)
    csx=csd.upper()
    # print(csd)
    # print(data)
    #####back end validation
    if str(data["LPartition"])=="None":
        data["LPartition"]=""
    if data["UserId"]=="":
        return jsonify({"fault":"User ID hasn't been provided"})
    if data["lastName"]=="":
        return jsonify({"fault":"Last Name hasn't been provided"})
    #####Cisco database validation
    try:
        UserAdd=ucm.add_user(userid=f'{csx}',lastName=str(data["lastName"]),firstName=str(data["firstName"]),mailid=f'{data["email"]}')
        getUsr=ucm.get_user(userid=f'{csx}')
        print("getUsr",getUsr["userid"])
        ###Mongo insert before_user
        del getUsr["_raw_elements"]
        Database.insert_one(getUsr,"Before_User",id,date)
        print("getUsr",getUsr)
        # print("UserAdd",UserAdd)
    except:
        print({"fault":"User has not been added for a backEnd error"})
    ##checking if the line exists
    try:
        # getLine=ucm.get_directory_number(name=data["line1"],partition=data["LPartition"])
        getLineUUID=ucm.list_route_plan_specific(pattern=data["line1"])
        # print("getLineUUID",getLineUUID)
        if getLineUUID["return"]!=None:

            for L in getLineUUID["return"]["routePlan"]:
                print(L["dnOrPattern"],L["partition"])
                if L["dnOrPattern"]==data["line1"] and L["partition"]==data["LPartition"]:
                    data["Luuid"]=L["uuid"]
                    return jsonify({"fault":"Extension already exists"})
        else:

            addLinS=ucm.add_directory_number(
    pattern=int(data["line1"]),partition=data["LPartition"],description=f'{data["firstName"]} {data["lastName"]}',alerting_name=f'{data["Display"]}',ascii_alerting_name=f'{data["Display"]}',forward_to_vm_noReply='false')
            # print("addLinS",addLinS)
            data["Luuid"]=addLinS["return"]

            print(data)
            try:
                ###Mongo insert After_DN
                dir=ucm.get_directory_number({"uuid":data["Luuid"]})
                print("dir",dir)
                Database.insert_one(dir,"After_DN",id,date)
            except:
                print("data -DN- has not been inserted to mongo")
            
    except:
        return jsonify({"fault":"Extension has not been added for a backEnd error"})
    if "checkedCSF" in data:
        if(str(data["checkedCSF"])=="true"):
            ##validation
            getPhone=ucm.get_phone(name=f'CSF{csx}')
            try:
                print("getPhone",getPhone)
            except:
                print("No softphone was found")
                # return jsonify({"fault":"No softphone was found"})
            else:
                if("Item not valid:" not in str(getPhone)):
                    return jsonify({"fault":"User already have a softPhone"})
            try:
                addPhone=ucm.add_phone(name=f'CSF{csx}',description=f'CSF {data["lastName"]} {data["firstName"]}',product='Cisco Unified Client Services Framework',protocol='SIP',phone_template="Standard Client Services Framework"
            ,lines=[
                    (f'{data["line1"]}', f'{data["LPartition"]}', f'{data["firstName"]} {data["lastName"]}', f'{data["firstName"]} {data["lastName"]}', f'{data["firstName"]} {data["lastName"]} - {data["line1"]}', '+1408202XXXX'),
                    ]
            )
                getPhone=ucm.get_phone(name=f'CSF{csx}')
                print("addPhoneNEW",addPhone)
                ###Mongo insert After_Device
                Database.insert_one(getPhone,"After_Device",id,date)
            
            except:
                return jsonify({"fault":"Soft phone has not been added"})
            try:
                userUpdateCSF=ucm.update_user(userid=f'{csx}',associatedDevices={"device":f'CSF{csx}'},selfService=f'{data["line1"]}',directoryUri=f'{data["email"]}')
                print("userUpdateCSF",userUpdateCSF)
            except:
                return jsonify({"fault":"User enduser page has not been updated with soft phone configurations"})
    
    try:
        if "checkedEM" in data:
            
            if(str(data["checkedEM"])=="true"):
                ##validation
                getProfile=ucm.get_device_profile(name=f'{csx}')
                try:
                    print("getProfile",getProfile)
                    ###Mongo insert Before_Device
                    Database.insert_one(getProfile,"Before_Device",id,date)
                    print("device profile exists")

                except:
                    print("No device profile was found")
                try:
                    addDeviceProfile = ucm.add_device_profile(name=f'{csx}',description=f'{data["line1"]} {data["lastName"]} {data["firstName"]}',
                    lines=[
                    (f'{data["line1"]}', f'{data["LPartition"]}', f'{data["firstName"]} {data["lastName"]}', f'{data["firstName"]} {data["lastName"]}', f'{data["firstName"]} {data["lastName"]} - {data["line1"]}', '+1408202XXXX'),]
                    )
                    print("addDeviceProfile",addDeviceProfile)
                except:
                    return jsonify({"fault":"Device profile has not been added for one of parameters error"})

    except:
        return jsonify({"fault":"Device profile has not been added for back-end validation"})
    try:
        getdeviceprofile=ucm.get_device_profile(name=f'{csx}')
        print("getdeviceprofile",getdeviceprofile["return"]["deviceProfile"]["uuid"])
        ###Mongo insert After_Device
        Database.insert_one(getdeviceprofile,"After_Device",id,date)
        userUpdateEM=ucm.update_user_em(user_id=f'{csx}',device_profile=f'{csx}',default_profile=f'{csx}',subscribe_css="",primary_extension=["",""])
        userUpdateEM3=ucm.update_user_em(user_id=f'{csx}',device_profile=f'{csx}',default_profile=f'{csx}',subscribe_css="",primary_extension=[data["line1"],data["LPartition"]])
        print("userUpdateEM",userUpdateEM)
        print("userUpdateEM3",userUpdateEM3)
        
        # print("userUpdateEM",userUpdateEM["return"])
    except:
        return jsonify({"fault":"End user page has not been updated with device profile configuration"})
    try:
        rand=random.randint(1,50)
        
        userUpdateEM2=ucm.update_user(userid=f'{csx}*{rand}',selfService=f'{data["line1"]}',directoryUri=f'{data["email"]}',mailid=f'{data["email"]}')
        print("userUpdateEM2",userUpdateEM2)
        
    except:
        error.append({"error":"End user page has not been updated with EM configuration"})
    UserFind=ucm.get_user(userid=f'{csx}')
    try:
        print(UserFind["userid"])
        
        
    except:
        error.append({"error":"Couldn't get all users parameters for some reasons, Kindly contact your adminstrator"})
    # phoneName=print(addPhone['name'])
    # phoneName=getphone['name']
    # print(UserAdd,addLinS,UserFind)
    PExt=""
    
    if(UserFind['primaryExtension']!=None):
        PExt=str(UserFind['primaryExtension']["pattern"])
        # Ext=str(UserFind['primaryExtension']["pattern"])
        print("primaryExtension",UserFind['primaryExtension']["pattern"])
    else:
        return jsonify({"fault":"Primary extension hasn't been updated"})
    if str(data["VM"])=="true":

        try:
            AddVM=cuc.Add_User(UserId=f"{csx}",Extension=data["line1"],Template=data["VMTemplate"])
            getVM=cuc.Get_User(f"{csx}")
            try:
                print("getVM",getVM["User"])
                ###Mongo insert After_VM
                Database.insert_one(getVM,"After_VM",id,date)
            except:
                print("No VM profile was found in the CUC related to the user's name")
            print(AddVM.status_code)
            if AddVM.status_code!=201:
                return jsonify({"fault":"User has been added to CUCM BUT not to CUC, kindly check if user or extension exists in CUC"})
            try:
                updateLine=ucm.update_directory_number(uuid=data["Luuid"],voiceMailProfileName="DefaultVM")
                print("UpdateLineVM",updateLine)
            except:
                error.append({"error":"user DN has not been updated with VM profile"})
            
            ###Mongo insert After_User
            try:
                getAfterUsr=ucm.get_user(f"{csx}")
                del getAfterUsr["_raw_elements"]
                Database.insert_one(getAfterUsr,"After_User",id,date)
            except:
                print("Mongo cannot handle After_User entry")


            Database.insert_action("Adduser package",date,id)
        except:
            return jsonify({"fault":"User has been added to CUCM BUT not to CUC"})

    # try:
    return jsonify({"error":error,"data":{"UserId":str(UserFind['userid']),"firstName":str(UserFind['firstName']),"lastName":str(UserFind['lastName']),"mailid":str(UserFind['mailid']),"PrimaryExtension":PExt},"status":"success","action":"nav"})
    # except:
    #     return(jsonify({"fault":"Couldn't get all users parameters for some reasons, Kindly contact your adminstrator"}))


@app.route('/checkUserAvInfo',methods=['GET',"POST"])
def checkUserAvInfo(data):
    data=request.json
    print(data)
    UserFind=ucm.get_user(userid=f'{data["UserId"]}')
    print(UserFind)
    # UserCheck=ucm.get_users()
    if (data["UserId"]=="") or str(UserFind)=="Item not valid: The specified User was not found":
        return False
    elif UserFind["userid"].upper()==data["UserId"].upper():
        return True 

@app.route('/getUserInfo/<UserId>',methods=["GET"])
def getUserInfo(UserId):
    print(str(UserId).upper())
    UserInfo=dict()
    userState=""
    UserFind=ucm.get_user(userid=str(UserId).upper())
    # print(UserFind)
    try:
        if(str(UserFind)=="Item not valid: The specified User was not found"):
            
            return jsonify(fault="Not Found")
        else:
            if UserFind["ldapDirectoryName"]["_value_1"]!=None and UserFind["status"]==1:
                userState="Avtive LDAP User"
            elif UserFind["ldapDirectoryName"]["_value_1"]==None and UserFind["status"]==1:
                userState="Enabled Local User"
            elif UserFind["status"]==2:
                userState="InActive LDAP User (Deleting This user is Recommended)"
            else:
                userState="User state is not (known Report Your admin)"
            UserInfo["firstName"]=UserFind["firstName"]
            UserInfo["lastName"]=UserFind["lastName"]
            UserInfo["UserId"]=UserFind["userid"]
            UserInfo["mailid"]=UserFind["mailid"]
            try:
                UserInfo["PrimaryExtension"]=UserFind["primaryExtension"]["pattern"]
            except:
                UserInfo["PrimaryExtension"]=None
            UserInfo["UserState"]=userState
            
            # print(UserInfo)
            ###Devices Info
            pp=[]
            if(UserFind["associatedDevices"]==None):
                phoneNames=[]
            else:
                phoneNames=UserFind["associatedDevices"]["device"]
            if(UserFind["phoneProfiles"]==None):
                profileNames=[]
            else:
                profileNames=UserFind["phoneProfiles"]["profileName"]
            ##We need a loop for profiles as they are not in array
            for p in profileNames:
                profileAdd=pp.append(p["_value_1"])
            ### print(phoneNames)
            DExs=[]
            pde=[]
            Intial=[]
            if (len(phoneNames)>0):
                for AD in phoneNames:
                    GetDeviceInfo1=ucm.get_phone(name=f'{AD}')
                    # print(GetDeviceInfo1)
                    if GetDeviceInfo1["lines"]==None:
                        pde=[]
                    else:
                        DevicesInfo=GetDeviceInfo1["lines"]["line"]
                        for i in DevicesInfo:
                            U=i["dirn"]["uuid"]
                            D=i["dirn"]["pattern"]
                            S=i["dirn"]["routePartitionName"]["_value_1"]
                            data2=pde.append({"name":f'{D}',"partition":f'{S}',"uuid":f'{U}'})
                    DeviceClass=GetDeviceInfo1["class"]
                    
                    data1=Intial.append({"device":f'{AD}',"class":f'{DeviceClass}',"extensions":pde})
                    pde=[]
            ppe=[]
            if(len(pp)>0):
                for AD in pp:
                    Deviceprofile=ucm.get_device_profile(name=f'{AD}')
                    # print(Deviceprofile)
                    if GetDeviceInfo1["lines"]==None:
                        ppe=[]
                    else:
                        DevicesInfo=Deviceprofile["return"]["deviceProfile"]["lines"]["line"]
                        for i in DevicesInfo:
                            U=i["dirn"]["uuid"]
                            D=i["dirn"]["pattern"]
                            # print(D)
                            S=i["dirn"]["routePartitionName"]["_value_1"]
                            data2=ppe.append({"name":f'{D}',"partition":f'{S}',"uuid":f'{U}'})
                    DeviceClassP=Deviceprofile["return"]["deviceProfile"]["class"]
                    data1=Intial.append({"device":f'{AD}',"class":f'{DeviceClassP}',"extensions":ppe})
                    # print(ppe)
                    ppe=[]
            # print(UserInfo)
            return jsonify({"data":{"UserInfo":UserInfo,"devices":Intial}})
    except:
        return jsonify({"error":"Connection between Back end and CUCM is Down"})

@app.route('/checkUserInfo',methods=['GET',"POST"])
def checkUserInfo():
    data=request.json
    userdata=data["UserId"]
    userdata.casefold()
    # print(userdata)
    ucm = axl(username=username,password=password,cucm=cucm,cucm_version=version)
    UserFind=ucm.get_user(userid=f'{userdata}')
    # ##print(UserFind)
    pp=[]
    if(str(UserFind)=="Item not valid: The specified User was not found"):
        return jsonify(errors="Not Found")
    else:
        if(UserFind["associatedDevices"]==None):
            phoneNames=[]
        else:
            phoneNames=UserFind["associatedDevices"]["device"]
        if(UserFind["phoneProfiles"]==None):
            profileNames=[]
        else:
            profileNames=UserFind["phoneProfiles"]["profileName"]
        ##We need a loop for profiles as they are not in array
        for p in profileNames:
            profileAdd=pp.append(p["_value_1"])
        ### print(phoneNames)
        DExs=[]
        pde=[]
        Intial=[]
        if (len(phoneNames)>0):
            for AD in phoneNames:
                GetDeviceInfo1=ucm.get_phone(name=f'{AD}')
                # print(GetDeviceInfo1)
                if GetDeviceInfo1["lines"]==None:
                    pde=[]
                else:
                    DevicesInfo=GetDeviceInfo1["lines"]["line"]
                    for i in DevicesInfo:
                        U=i["dirn"]["uuid"]
                        D=i["dirn"]["pattern"]
                        S=i["dirn"]["routePartitionName"]["_value_1"]
                        data2=pde.append({"name":f'{D}',"partition":f'{S}',"uuid":f'{U}'})
                DeviceClass=GetDeviceInfo1["class"]
                
                data1=Intial.append({"device":f'{AD}',"class":f'{DeviceClass}',"extensions":pde})
                pde=[]
        ppe=[]
        if(len(pp)>0):
            for AD in pp:
                Deviceprofile=ucm.get_device_profile(name=f'{AD}')
                print(Deviceprofile)
                if Deviceprofile["return"]["deviceProfile"]["lines"]==None:
                    ppe=[]
                else:
                    DevicesInfo=Deviceprofile["return"]["deviceProfile"]["lines"]["line"]
                    for i in DevicesInfo:
                        U=i["dirn"]["uuid"]
                        D=i["dirn"]["pattern"]
                        # print(D)
                        S=i["dirn"]["routePartitionName"]["_value_1"]
                        data2=ppe.append({"name":f'{D}',"partition":f'{S}',"uuid":f'{U}'})
                DeviceClassP=Deviceprofile["return"]["deviceProfile"]["class"]
                data1=Intial.append({"device":f'{AD}',"class":f'{DeviceClassP}',"extensions":ppe})
                print(ppe)
                ppe=[]
        # print(Intial)
        
        getUserVM=cuc.Get_User(userdata)
        pprint(getUserVM)
        Exs=[]
        try:
            getUserVM["User"]["Alias"]
            GetEx=cuc.Get_User_Extensions(userdata)
            # pprint(GetEx)
            if GetEx["@total"]=="1":
                extensions=GetEx["AlternateExtension"]["DtmfAccessId"]
                ExId=GetEx["AlternateExtension"]["ObjectId"]
                PId=GetEx["AlternateExtension"]["PartitionObjectId"]
                Exs.append({"name":extensions,"objectId":ExId,"PartitionUuid":PId})
            elif GetEx["@total"]=="0":
                extensions=""
                ExId=""

            else:
                for extensions in GetEx["AlternateExtension"]:
                    Exs.append({"name":extensions["DtmfAccessId"],"objectId":extensions["ObjectId"]})

            Intial.append({"device":getUserVM["User"]["Alias"],"class":"VoiceMail Box","objectId":getUserVM["User"]["ObjectId"],"extensions":Exs})
            
        except:
            
            print(f"User {userdata} doesn't have VM")
        print(Intial)
        return jsonify({"data":Intial})
    # return jsonify({"data":[{'device': 'TCTUSER018', 'extensions': ['1018']}, {'device': 'user18', 'extensions': ['1018', '1012']}]})

@app.route('/checkTransfer',methods=['GET',"POST"])
def checkTransfer():
    data=request.json
    userdata=data["UserId"]
    userdata.casefold()
    # print(userdata)
    ucm = axl(username=username,password=password,cucm=cucm,cucm_version=version)
    UserFind=ucm.get_user(userid=f'{userdata}')
    # print(UserFind)
    pp=[]
    if(str(UserFind)=="Item not valid: The specified User was not found"):
        return jsonify(errors="Not Found")
    else:
        if(UserFind["associatedDevices"]==None):
            phoneNames=[]
        else:
            phoneNames=UserFind["associatedDevices"]["device"]
        if(UserFind["phoneProfiles"]==None):
            profileNames=[]
        else:
            profileNames=UserFind["phoneProfiles"]["profileName"]
        ##We need a loop for profiles as they are not in array
        for p in profileNames:
            profileAdd=pp.append(p["_value_1"])
        ### print(phoneNames)
        DExs=[]
        pde=[]
        Intial={}
        if (len(phoneNames)>0):
            Intial["phoneDevices"]=[]
            for AD in phoneNames:
                GetDeviceInfo1=ucm.get_phone(name=f'{AD}')
                # print("GetDeviceInfo1",GetDeviceInfo1)
                uuid=GetDeviceInfo1["uuid"]
                # print("uuid for the device",uuid)
                if GetDeviceInfo1["lines"]==None:
                    pde=[]
                else:
                    print(GetDeviceInfo1["lines"]["line"])
                    DevicesInfo=GetDeviceInfo1["lines"]["line"]
                    for i in DevicesInfo:
                        U=i["dirn"]["uuid"]
                        D=i["dirn"]["pattern"]
                        S=i["dirn"]["routePartitionName"]["_value_1"]
                        data2=pde.append({"name":f'{D}',"partition":f'{S}',"uuid":f'{U}'})
                DeviceClass=GetDeviceInfo1["class"]
                
                Intial["phoneDevices"].append({"device":f'{AD}',"class":f'{DeviceClass}',"uuid":uuid,"extensions":pde})
                pde=[]
        ppe=[]
        if(len(pp)>0):
            Intial["deviceProfiles"]=[]
            for AD in pp:
                Deviceprofile=ucm.get_device_profile(name=f'{AD}')
                print(Deviceprofile)
                if Deviceprofile["return"]["deviceProfile"]["lines"]==None:
                    ppe=[]
                else:
                    DevicesInfo=Deviceprofile["return"]["deviceProfile"]["lines"]["line"]
                    for i in DevicesInfo:
                        U=i["dirn"]["uuid"]
                        D=i["dirn"]["pattern"]
                        # print(D)
                        S=i["dirn"]["routePartitionName"]["_value_1"]
                        data2=ppe.append({"name":f'{D}',"partition":f'{S}',"uuid":f'{U}'})
                DeviceClassP=Deviceprofile["return"]["deviceProfile"]["class"]
                uuidDP=Deviceprofile["return"]["deviceProfile"]["uuid"]
                
                Intial["deviceProfiles"].append({"device":f'{AD}',"uuid":uuidDP,"class":f'{DeviceClassP}',"extensions":ppe})
                print(ppe)
                ppe=[]
        # print(Intial)
        
        getUserVM=cuc.Get_User(userdata)
        pprint(getUserVM)
        Exs=[]
        
        
        try:
            getUserVM["User"]["Alias"]
            GetEx=cuc.Get_User_Extensions(userdata)
            
            if GetEx["@total"]=="1":
                extensions=GetEx["AlternateExtension"]["DtmfAccessId"]
                ExId=GetEx["AlternateExtension"]["ObjectId"]
                PId=GetEx["AlternateExtension"]["PartitionObjectId"]
                Exs.append({"name":extensions,"uuid":ExId,"PartitionUuid":PId})
                Intial["VM"]=[]
            elif GetEx["@total"]=="0":
                extensions=""
                ExId=""

            else:
                for extensions in GetEx["AlternateExtension"]:
                    Exs.append({"name":extensions["DtmfAccessId"],"uuid":extensions["ObjectId"],"PartitionUuid":PId})
            
            Intial["VM"].append({"device":getUserVM["User"]["Alias"],"class":"VoiceMail Box","uuid":getUserVM["User"]["ObjectId"],"extensions":Exs})
            
        except:
            
            print(f"User {userdata} doesn't have VM")
        print(Intial)
        return jsonify({"data":Intial})

@app.route('/checkDeviceInfo',methods=['GET',"POST"])
def checkDeviceInfo():
    data=request.json
    id=uuid.uuid1().hex
    userdata=data["DDevice"]
    print(userdata)
    DeviceAxl=[]
    Initial=[]
    DInfo=ucm.get_phones(name=f"{userdata}")
    # print(DInfo)
    if len(DInfo)>0:
        for D in DInfo:
            DeviceInfo=ucm.get_phone(uuid=D["uuid"])
            # DeviceInfo["Ref"]=id
            DeviceInfo["_id"]=uuid.uuid4().hex
            
            # print(DeviceInfo)
            try:
                
                DeviceAxl.append(xml_dict(DeviceInfo))
            except:
                print("device wasn't added to mongo list")
            Exts=[]
            try:
                if DeviceInfo["lines"]==None:
                        Ext=[]
                else:
                    for line in DeviceInfo["lines"]["line"]:
                # print(line["dirn"]["pattern"],line["dirn"]["routePartitionName"]["_value_1"])
                        Exts.append({"extension":line["dirn"]["pattern"],"partition":line["dirn"]["routePartitionName"]["_value_1"],"uuid":line["dirn"]["uuid"]})
            except TimeoutError:
                Exts=[]
                return jsonify({"fault":"eror during handling with Cicso server","relation":"This error related to the device"})
            # print(DeviceInfo)
            try:
                Initial.append({"device":DeviceInfo["name"],"class":DeviceInfo["class"],"description":DeviceInfo["description"],"uuid":DeviceInfo["uuid"],"lines":Exts})
            except:
                
                return jsonify({"fault":f"{str(DeviceInfo)} This error related to the device","relation":"This error related to the device"})
    
    ProfileInfo=ucm.get_device_profiles(name=userdata)
    # print(ProfileInfo)
    try:
        if len(ProfileInfo["return"]["deviceProfile"])>0:
            for D in ProfileInfo["return"]["deviceProfile"]:
                DeviceInf=ucm.get_device_profile(uuid=D["uuid"])
                DeviceInfo=DeviceInf["return"]["deviceProfile"]
                # DeviceInfo["Ref"]=id
                DeviceInfo["_id"]=uuid.uuid1().hex
                # print("DeviceInfo",DeviceInfo)
                Exts=[]
                try:
                    DeviceAxl.append(xml_dict(DeviceInfo))
                except:
                    print("device wasn't found")
                try:
                    if DeviceInfo["lines"]==None:
                        Ext=[]
                    else:
                        for line in DeviceInfo["lines"]["line"]:
                            
                        # print(line["dirn"]["pattern"],line["dirn"]["routePartitionName"]["_value_1"])
                            Exts.append({"extension":line["dirn"]["pattern"],"partition":line["dirn"]["routePartitionName"]["_value_1"],"uuid":line["dirn"]["uuid"]})
                except:
                    Exts=[]
                    return jsonify({"fault":"eror during handling with Cicso server","relation":"This error related to the device"})
                # print(DeviceInfo)
                try:
                    Initial.append({"device":DeviceInfo["name"],"class":DeviceInfo["class"],"description":DeviceInfo["description"],"uuid":DeviceInfo["uuid"],"lines":Exts})
                except:
                    
                    return jsonify({"fault":str(DeviceInfo["name"]),"relation":"This error related to the device"})
    except:
        print("No device profile")

    # print(DInfo)

    
    # try:
    #     # print("name",DeviceInfo["name"])
    #     # print("description",DeviceInfo["description"] )
    #     try:
    #         for line in DeviceInfo["lines"]["line"]:
    #         # print(line["dirn"]["pattern"],line["dirn"]["routePartitionName"]["_value_1"])
    #             Exts.append({"extension":line["dirn"]["pattern"],"partition":line["dirn"]["routePartitionName"]["_value_1"],"uuid":line["dirn"]["uuid"]})
    #     except TimeoutError:
    #         Exts=[]
    #         return jsonify({"fault":"eror during handling with Cicso server","relation":"This error related to the device"})
    #     # print(DeviceInfo)
        
    # except:
    #     return jsonify({"fault":str(DeviceInfo),"relation":"This error related to the device"})
    # try:
    #     Initial.append({"device":DeviceInfo["name"],"description":DeviceInfo["description"],"lines":Exts})
    # except:
    #     Initial=[]
    #     return jsonify({"fault":str(DeviceInfo),"relation":"This error related to the device"})
    # print("DeviceAxl",DeviceAxl)
    try:
        if len(Initial) !=0:
            db.table("first_collection").insert_many(DeviceAxl)
    except:
        print("Mongo cannot handle entries")

        # first_collection.insert_many(DeviceAxl)
    
    return jsonify({"data":Initial})

@app.route('/checkExtensionInfo',methods=['GET',"POST"])
def checkExtensionInfo():
    data=request.json
    userdata=data["DExtension"]
    print(userdata)
    try:
        rpr=ucm.list_route_plan_specific(pattern=userdata)
        # print(rpr)
        if(rpr["return"]==None):
                return jsonify({"fault":"Extension info was not found"})
        # for R in rpr["return"]["routePlan"]:
        #     print(R)
    except TimeoutError or TypeError:
        print("error 103 Something is wrong Kindly contact adminstrator")
        return jsonify({"fault":"Something is wrong Kindly contact adminstrator"})

    try:
        print(rpr["return"])
        ExtPattern=rpr["return"]['routePlan'][0]["dnOrPattern"]
        ExtPartition=rpr["return"]['routePlan'][0]["partition"]["_value_1"]
        uuidIn=rpr["return"]['routePlan'][0]["uuid"]
        Initial=[{"extenion":ExtPattern,"partition":ExtPartition,"uuid":uuidIn,"devices":[]}]
        for E in rpr["return"]['routePlan']:
            
            try:
                try:
                    getPh=ucm.get_phone(name=E["routeDetail"])
                    DType=getPh["class"]
                except:
                    getP=ucm.get_device_profile(name=E["routeDetail"])
                    DType=getP["class"]
            except:
                DType=E["type"]
            
            Device=E["routeDetail"]
            DDn=E['dnOrPattern']
            DevicePt=E['partition']['_value_1']
            uuid=E["uuid"]
            index=False
            i=0
            while i <len(Initial) :
                if DevicePt == Initial[i]["partition"]:
                    # print(Initial[i]["partition"])
                    index=False
                if DevicePt != Initial[i]["partition"]:
                    index=True
                i+=1
            if index==True:
                Initial.append({"extenion":DDn,"partition":DevicePt,"uuid":uuid,"devices":[]})
            for Pe in Initial:
                if str(Pe['partition']) == str(DevicePt) and Device!=None:
                    Pe['devices'].append({"type":DType,"device":Device})
        print(Initial)
        return({"data":Initial})
           
    except: 
        print("something is wrong")
        return jsonify({"fault":"something is wrong"})
    # return jsonify({"data":[{'extenion': '1018', 'partition': None, 'devices': [{'type': 'Device', 'device': 'TCTUSER018'}]}, {'extenion': '1018', 'partition': 'toema-pt', 'devices': [{'type': 'Device', 'device': 'CSFUSER003'}, {'type': 'Device', 'device': 'CSFUSER002'}]}]})


@app.route('/DeleteAssets',methods=['GET',"POST"])
def DeleteAssets():
    data=request.json
    # print(data)
    Action=[]
    TableTypes=data.keys()
    # print(TableTypes)
    print(data)
    if "DUser" in TableTypes and data["DType"]=="UserId":
        UserFind=ucm.get_user(userid=f'{data["DUser"]}')
        try:
            deleteVM=cuc.Delete_User(data["DUser"])
            print("deleteVM",deleteVM)
        except:
            return jsonify({"fault":"Couldn't delete user account from CUC"})
        # print(UserFind)
        pp=[]
        if(str(UserFind)=="Item not valid: The specified User was not found"):
            return jsonify(data="",fault="The user doesn't exist anymore")
        else:
            if(UserFind["associatedDevices"]==None):
                phoneNames=[]
                for i in data["assets"]:
                    if i["class"]=="Phone":
                        return jsonify(data="",fault="This device is no longer with the user")
            else:
                phoneNames=UserFind["associatedDevices"]["device"]
                # print(len(phoneNames))
            if(UserFind["phoneProfiles"]==None):
                profileNames=[]
                for i in data["assets"]:
                    if i["class"]=="Device Profile":
                        return jsonify(data="",fault="This device profile is no longer with the user")
            else:
                profileNames=UserFind["phoneProfiles"]["profileName"]
            ##We need a loop for profiles as they are not in array
            for p in profileNames:
                profileAdd=pp.append(p["_value_1"])
            ### print(phoneNames)
            
            pde=[]
            Intial=[]
            if (len(phoneNames)>0):
                # print(phoneNames)
                for AD in phoneNames:
                    # print(AD)
                    for W in data["assets"]:
                        # print(AD,W)
                        if AD==W["name"]:
                            try:
                                for Ext in W["extension"]:
                                    
                                    try:
                                        ##Deleting secodnary assets
                                        if str(Ext["state"])=="True":
                                            
                                            line=ucm.get_directory_number(uuid=f'{Ext["uuid"]}')
                                            # print(line)
                                            LDevices=line["return"]["line"]["associatedDevices"]["device"]
                                            print(LDevices)
                                            LDevices.remove(W["name"])
                                            print(LDevices)
                                            if len(LDevices)>0:
                                                try:
                                                    ADevice=ucm.get_phone(name=W["name"])
                                                    ADevice["lines"]["line"]
                                                except:
                                                    return jsonify({"fault":"This device doesn't exist anymore"})
                                                for Line in ADevice["lines"]["line"]:
                                                    try:
                                                        if Line["dirn"]["uuid"]==Ext["uuid"]:
                                                            RLine=ucm.update_phone(name=f'{W["name"]}',removeLines={"line":Line})
                                                        else:
                                                            print(Line["dirn"]["pattern"],"This line won't be deassociated")
                                                    except:
                                                        print("error while deleting line from device's list")
                                                
                                                getNPhone=ucm.get_phone(name=W["name"])
                                                # print(getNPhone["lines"]["line"])
                                                try:
                                                    for e in range(len(getNPhone["lines"]["line"])):
                                                        NDevice=ucm.update_phone(name=f'{W["name"]}',removeLines={"line":getNPhone["lines"]["line"][e]})
                                                        getNPhone["lines"]["line"][e]["index"]=e+1
                                                        NDevice=ucm.update_phone(name=f'{W["name"]}',addLines={"line":getNPhone["lines"]["line"][e]})
                                                        print(NDevice)
                                                except:
                                                    print("error while updating line indexes")
                                            elif len(LDevices)==0:
                                                try:
                                                    print(Ext["uuid"])
                                                    DeleteLine=ucm.delete_directory_number(uuid=f'{Ext["uuid"]}')
                                                    print(DeleteLine)
                                                except:
                                                    print("error while terminating extension", "This extension doesn't exist or uuid has been changed")
                                                getNPhone=ucm.get_phone(name=W["name"])
                                                try:
                                                    for e in range(len(getNPhone["lines"]["line"])):
                                                        NDevice=ucm.update_phone(name=f'{W["name"]}',removeLines={"line":getNPhone["lines"]["line"][e]})
                                                        getNPhone["lines"]["line"][e]["index"]=e+1
                                                        NDevice=ucm.update_phone(name=f'{W["name"]}',addLines={"line":getNPhone["lines"]["line"][e]})
                                                        # print(NDevice)
                                                except:
                                                    print("error while updating line indexes")
                                            print(True,"Extension state is TRUE")
                                    except:
                                        print(Ext["extension"],"No actions on phone extensions")
                            except:
                                print("no lines associated with PDs")
                                ##Deleting primary asset
                            if str(W["state"])== "True":
                                DeletedDevice=ucm.delete_phone(name=f'{W["name"]}')
                                print(DeletedDevice)
                                CheckDDevice=ucm.get_phone(name=f'{W["name"]}')
                                print(CheckDDevice)
                                if "Item not valid" in str(CheckDDevice):
                                    Action.append({"action":"Delete","device":f'{W["name"]}',"state":"Success"})
                                try:
                                    for Ext in W["extension"]:
                                        line=ucm.get_directory_number(uuid=f'{Ext["uuid"]}')
                                        try:
                                            LDevices=line["return"]["line"]["associatedDevices"]["device"]
                                        except:
                                            DeleteLine=ucm.delete_directory_number(uuid=f'{Ext["uuid"]}')
                                except:
                                    print("no lines associated with PDs error2")
                        # if AD==W["name"] and str(W["state"])!= "True":
                    # GetDeviceInfo1=ucm.get_phone(name=f'{AD}')
                    # # print(GetDeviceInfo1)
                    # DevicesInfo=GetDeviceInfo1["lines"]["line"]
                    # DeviceClass=GetDeviceInfo1["class"]
                    # for i in DevicesInfo:
                    #     D=i["dirn"]["pattern"]
                    #     S=i["dirn"]["routePartitionName"]["_value_1"]
                    #     data2=pde.append({"name":f'{D}',"partition":f'{S}'})
                    # data1=Intial.append({"device":f'{AD}',"class":f'{DeviceClass}',"extensions":pde})
                    # pde=[]
            ppe=[]
            if(len(pp)>0):
                
                for AD in pp:
                    for W in data["assets"]:
                        
                        if AD==W["name"]:
                            try:
                                for Ext in W["extension"]:
                                    try:
                                        ##Deleting secodnary assets
                                        if str(Ext["state"])=="True":
                                            
                                            line=ucm.get_directory_number(uuid=f'{Ext["uuid"]}')
                                            # print(line)
                                            LDevices=line["return"]["line"]["associatedDevices"]["device"]
                                            # print(LDevices)
                                            LDevices.remove(W["name"])
                                            print(LDevices)
                                            DPLines=[]
                                            if len(LDevices)>0:
                                                try:
                                                    ADevice=ucm.get_device_profile(name=W["name"])
                                                    if ADevice["return"]["deviceProfile"]["lines"]==None:
                                                        DPLines=[]
                                                    else:
                                                        DPLines=ADevice["return"]["deviceProfile"]["lines"]["line"]
                                                    for Line in DPLines:
                                                        # print(Line)
                                                        try:
                                                            if Line["dirn"]["uuid"]==Ext["uuid"]:
                                                                # #RLine=ucm.update_device_profile(name=f'{W["name"]}',removeLines={"line":Line})
                                                                ## print(RLine)
                                                                print(DPLines)
                                                                DPLines.remove(Line)

                                                                print(DPLines)
                                                            else:
                                                                print(Line["dirn"]["pattern"],"This line won't be deassociated")
                                                        except:
                                                            print("error while deleting line from device's list")
                                                except:
                                                    # return jsonify({"fault":"This device doesn't exist anymore"})
                                                    print({"fault":"This device doesn't exist anymore"})
                                                
                                                
                                                # getNPhone=ucm.get_device_profile(name=W["name"])
                                                # print(getNPhone["lines"]["line"])
                                                try:
                                                    for e in range(len(DPLines)):
                                                        print(DPLines)
                                                        DPLines[e]["index"]=e+1
                                                        NDevice=ucm.update_device_profile(name=f'{W["name"]}',lines={"line":DPLines})
                                                        print(NDevice)
                                                except:
                                                    print("error 102 while updating line indexes")
                                            elif len(LDevices)==0:
                                                
                                                try:
                                                    print(Ext["uuid"])
                                                    DeleteLine=ucm.delete_directory_number(uuid=f'{Ext["uuid"]}')
                                                    print(DeleteLine)
                                                except:
                                                    print("error while terminating extension", "This extension doesn't exist or uuid has been changed")
                                                # getNPhone=ucm.get_device_profile(name=W["name"])
                                                try:
                                                    ADevice=ucm.get_device_profile(name=W["name"])
                                                    if ADevice["return"]["deviceProfile"]["lines"]==None:
                                                        DPLines=[]
                                                    else:
                                                        DPLines=ADevice["return"]["deviceProfile"]["lines"]["line"]
                                                    for e in range(len(DPLines)):
                                                        print(DPLines)
                                                        DPLines[e]["index"]=e+1
                                                        NDevice=ucm.update_device_profile(name=f'{W["name"]}',lines={"line":DPLines})
                                                        print(NDevice)
                                                except:
                                                    print("error 101 -device profile- while updating line indexes")
                                            print(True,"Extension state is TRUE")
                                    except:
                                        print(Ext["extension"],"No actions on phone extensions")
                            except:
                                print("no lines associated with PPs error21")
                            #####deleting primary asset -device profile-
                            if str(W["state"])== "True":
                                DeletedDevice=ucm.delete_device_profile(name=f'{W["name"]}')
                                print(DeletedDevice)
                                CheckDDevice=ucm.get_device_profile(name=f'{W["name"]}')
                                print(CheckDDevice)
                                if "Item not valid" in str(CheckDDevice):
                                    Action.append({"action":"Delete","device":f'{W["name"]}',"state":"Success"})
                                try:
                                    for Ext in W["extension"]:
                                        line=ucm.get_directory_number(uuid=f'{Ext["uuid"]}')
                                        # print("Line of the DP",line)
                                        try:
                                            LDevices=line["return"]["line"]["associatedDevices"]["device"]
                                        except:
                                        
                                            DeleteLine=ucm.delete_directory_number(uuid=f'{Ext["uuid"]}')
                                except:
                                    print("no lines associated with PPs error22")
                        # Deviceprofile=ucm.get_device_profile(name=f'{AD}')
                    # # print(Deviceprofile)
                    # DevicesInfo=Deviceprofile["return"]["deviceProfile"]["lines"]["line"]
                    # DeviceClassP=Deviceprofile["return"]["deviceProfile"]["class"]
                    # for i in DevicesInfo:
                    #     D=i["dirn"]["pattern"]
                    #     # print(D)
                    #     S=i["dirn"]["routePartitionName"]["_value_1"]
                    #     data2=ppe.append({"name":f'{D}',"partition":f'{S}'})
                    # data1=Intial.append({"device":f'{AD}',"class":f'{DeviceClassP}',"extensions":ppe})
                    # # print(ppe)
                    # ppe=[]
            # print(Intial)
        return jsonify({"data":{"action":"user assets has been deleted", "state":"success"}})
            ###################################################################
    if "DDevice" in TableTypes and data["DType"]=="Device":
        for De in data["devices"]:
            print(De)
            #####Deleting primary asset phone
            if str(De["state"])== "True" and De["type"]=="Phone":
                DeletedDevice=ucm.delete_phone(name=f'{De["name"]}')
                print(DeletedDevice)
                CheckDDevice=ucm.get_phone(name=f'{De["name"]}')
                print(CheckDDevice)
                if "Item not valid" in str(CheckDDevice):
                    Action.append({"action":f'Device - {De["name"]} -has been terminated',"device":f'{De["name"]}',"state":"Success"})
            #######Deleting Secondry asset phone
            for Li in De["extension"]:
                try:
                    if str(Li["state"])=="True" and De["type"]=="Phone":
                                                
                        line=ucm.get_directory_number(uuid=f'{Li["uuid"]}')
                        # print(line)
                        LDevices=line["return"]["line"]["associatedDevices"]["device"]
                        print(LDevices)
                        LDevices.remove(De["name"])
                        print(LDevices)
                        #####Just de-association
                        if len(LDevices)>0:
                            try:
                                ADevice=ucm.get_phone(name=De["name"])
                                ADevice["lines"]["line"]
                            except:
                                return jsonify({"fault":"This device doesn't exist anymore"})
                            for Line in ADevice["lines"]["line"]:
                                try:
                                    if Line["dirn"]["uuid"]==Ext["uuid"]:
                                        RLine=ucm.update_phone(name=f'{De["name"]}',removeLines={"line":Line})
                                    else:
                                        print(Line["dirn"]["pattern"],"This line won't be deassociated")
                                except:
                                    print("error while deleting line from device's list")
                            
                            getNPhone=ucm.get_phone(name=De["name"])
                            # print(getNPhone["lines"]["line"])
                            try:
                                for e in range(len(getNPhone["lines"]["line"])):
                                    NDevice=ucm.update_phone(name=f'{De["name"]}',removeLines={"line":getNPhone["lines"]["line"][e]})
                                    getNPhone["lines"]["line"][e]["index"]=e+1
                                    NDevice=ucm.update_phone(name=f'{De["name"]}',addLines={"line":getNPhone["lines"]["line"][e]})
                                    print(NDevice)
                                    Action.append({"action":f'Line - {Li["name"]} - with partition - {Li["partition"]} - has been de-associated from device - {De["name"]} -',"device":f'{Li["name"]}',"state":"Success"})

                            except:
                                print("error while updating line indexes")
                        #####Total termination
                        elif len(LDevices)==0:
                            try:
                                print(Ext["uuid"])
                                DeleteLine=ucm.delete_directory_number(uuid=f'{Li["uuid"]}')
                                print(DeleteLine)
                            except:
                                print("error while terminating extension", "This extension doesn't exist or uuid has been changed")
                            getNPhone=ucm.get_phone(name=De["name"])
                            try:
                                for e in range(len(getNPhone["lines"]["line"])):
                                    NDevice=ucm.update_phone(name=f'{De["name"]}',removeLines={"line":getNPhone["lines"]["line"][e]})
                                    getNPhone["lines"]["line"][e]["index"]=e+1
                                    NDevice=ucm.update_phone(name=f'{De["name"]}',addLines={"line":getNPhone["lines"]["line"][e]})
                                    Action.append({"action":f'Line - {Li["name"]} - with partition - {Li["partition"]} - has been terminated',"device":f'{Li["name"]}',"state":"Success"})

                                    # print(NDevice)
                            except:
                                print("error while updating line indexes")
                        print(True,"Extension state is TRUE")
                except:
                    print(Li["extension"],"extension won't be deleted")
            
            # ######Deleting primary asset phone
            # if str(De["state"])== "True" and De["type"]=="Phone":
            #                     DeletedDevice=ucm.delete_phone(name=f'{De["name"]}')
            #                     print(DeletedDevice)
            #                     CheckDDevice=ucm.get_phone(name=f'{De["name"]}')
            #                     print(CheckDDevice)
            #                     if "Item not valid" in str(CheckDDevice):
            #                         Action.append({"action":f'Device - {De["name"]} -has been terminated',"device":f'{De["name"]}',"state":"Success"})
            ######Deleting Secondry asset device profile
            for Li in De["extension"]:
                try:
                    if str(Li["state"])=="True" and De["type"]=="Device Profile":
                        line=ucm.get_directory_number(uuid=f'{Li["uuid"]}')
                        # print(line)
                        LDevices=line["return"]["line"]["associatedDevices"]["device"]
                        print(LDevices)
                        LDevices.remove(De["name"])
                        print(LDevices)
                        DPLines=[]
                        #####Just De-association
                        if len(LDevices)>0:
                            try:
                                ADevice=ucm.get_device_profile(name=De["name"])
                                if ADevice["return"]["deviceProfile"]["lines"]==None:
                                    DPLines=[]
                                else:
                                    DPLines=ADevice["return"]["deviceProfile"]["lines"]["line"]
                                for Line in DPLines:
                                    # print(Line)
                                    try:
                                        if Line["dirn"]["uuid"]==Li["uuid"]:
                                            DPLines.remove(Line)
                                        else:
                                            print(Line["dirn"]["pattern"],"This line won't be deassociated")
                                    except:
                                        print("error while deleting line from device's list")
                            except:
                                # return jsonify({"fault":"This device doesn't exist anymore"})
                                print({"fault":"This device doesn't exist anymore"})
                            try:
                                print(DPLines)
                                for e in range(len(DPLines)):
                                    DPLines[e]["index"]=e+1
                                    NDevice=ucm.update_device_profile(name=f'{De["name"]}',lines={"line":DPLines})
                                    print(NDevice,"Lines indexes has been updated")
                                    Action.append({"action":f'Line - {Li["extension"]} - with partition - {Li["partition"]} - has been terminated',"device":f'{Li["extension"]}',"state":"Success"})

                            except:
                                print("error 102 DDevice - device profile - while updating line indexes")
                        #####Total Termination
                        elif len(LDevices)==0:
                            
                            try:
                                print(Li["uuid"])
                                DeleteLine=ucm.delete_directory_number(uuid=f'{Li["uuid"]}')
                                print(DeleteLine)
                            except:
                                print("error while terminating extension", "This extension doesn't exist or uuid has been changed")
                            # getNPhone=ucm.get_device_profile(name=W["name"])
                            try:
                                ADevice=ucm.get_device_profile(name=De["name"])
                                if ADevice["return"]["deviceProfile"]["lines"]==None:
                                    DPLines=[]
                                else:
                                    DPLines=ADevice["return"]["deviceProfile"]["lines"]["line"]
                                    print(DPLines)
                                    for e in range(len(DPLines)):
                                        
                                        DPLines[e]["index"]=e+1
                                        NDevice=ucm.update_device_profile(name=f'{De["name"]}',lines={"line":DPLines})
                                        print(NDevice,"Lines indexes has been updated")
                                    Action.append({"action":f'Line - {Li["extension"]} - with partition - {Li["partition"]} - has been terminated',"device":f'{Li["extension"]}',"state":"Success"})
                                

                            except:
                                print("error 1071 -device profile- while updating line indexes")
                        print(True,"Extension state is TRUE")
                except:
                    print(Li["extension"],"extension won't be deleted")
            ######Deleting primary asset- device profile
            if str(De["state"])== "True" and De["type"]=="Device Profile":
                                DeletedDevice=ucm.delete_device_profile(name=f'{De["name"]}')
                                print(DeletedDevice)
                                CheckDDevice=ucm.get_device_profile(name=f'{De["name"]}')
                                print(CheckDDevice)
                                if "Item not valid" in str(CheckDDevice):
                                    Action.append({"action":f'Device - {De["name"]} -has been terminated',"device":f'{De["name"]}',"state":"Success"})
        return jsonify({"data":Action, "fault":"No faults right now"})
        

#####################################################################################
        # return jsonify({"data":[{'device': 'TCTUSER018', 'dextensions': ['1018']}, {'device': 'user18', 'extensions': ['1018', '1012']}]})
    if "DExtension" in TableTypes and data["DType"]=="Extension":
        #####Get all primaries
        for Dn in data["partition"]:
            GetExt=ucm.get_directory_number(uuid=f'{Dn["uuid"]}')
            try:
                if GetExt["return"]["line"]["associatedDevices"]==None:
                    AssoDevices=[]
                else:
                    AssoDevices=GetExt["return"]["line"]["associatedDevices"]["device"]
            except:
                return jsonify({"fault":"This extension does not exist anymore"})
            print(AssoDevices)
            # print(GetExt)
            try:
                for device in Dn["devices"]:
                    try:
                        if device["state"]==True and device["type"]=="Phone":
                            print(device["name"],"this device will be de-associated")
                            try:
                                ADevice=ucm.get_phone(name=device["name"])
                                print(ADevice)
                            except:
                                return jsonify({"fault":"This device doesn't exist anymore"})

                            for Line in ADevice["lines"]["line"]:
                                try:
                                    if Line["dirn"]["uuid"]==Dn["uuid"]:
                                        RLine=ucm.update_phone(name=f'{device["name"]}',removeLines={"line":Line})
                                    else:
                                        print(Line["dirn"]["pattern"],"This line won't be deassociated")
                                except:
                                    print("error while deleting line from device's list")
                            
                            getNPhone=ucm.get_phone(name=device["name"])
                            if getNPhone["lines"]==None:
                                DeletePhone=ucm.delete_phone(name=device["name"])
                                print(DeletePhone)
                            else:
                            # print(getNPhone["lines"]["line"])
                                try:
                                    for e in range(len(getNPhone["lines"]["line"])):
                                        NDevice=ucm.update_phone(name=f'{device["name"]}',removeLines={"line":getNPhone["lines"]["line"][e]})
                                        getNPhone["lines"]["line"][e]["index"]=e+1
                                        NDevice=ucm.update_phone(name=f'{device["name"]}',addLines={"line":getNPhone["lines"]["line"][e]})
                                        print(NDevice)
                                except:
                                    print("error while updating line indexes")
                        if device["state"]==True and device["type"]=="Device Profile":
                            print(device["name"],"this device profile will be de-associated")
                            DPLines=[]
                            try:
                                ADevice=ucm.get_device_profile(name=device["name"])
                                if ADevice["return"]["deviceProfile"]["lines"]==None:
                                    DPLines=[]
                                else:
                                    DPLines=ADevice["return"]["deviceProfile"]["lines"]["line"]
                                for Line in DPLines:
                                    # print(Line)
                                    try:
                                        if Line["dirn"]["uuid"]==Dn["uuid"]:
                                            # #RLine=ucm.update_device_profile(name=f'{W["name"]}',removeLines={"line":Line})
                                            ## print(RLine)
                                            # print(DPLines)
                                            DPLines.remove(Line)
                                            # print(DPLines)
                                        else:
                                            print(Line["dirn"]["pattern"],"This line won't be deassociated")
                                    except:
                                        print("error while deleting line from device's list")
                            except:
                                # return jsonify({"fault":"This device doesn't exist anymore"})
                                print({"fault":"This device doesn't exist anymore"})
                            if len(DPLines)==0:
                                DeleteDProfile=ucm.delete_device_profile(name=device["name"])
                            elif len(DPLines)>0:
                            
                            # getNPhone=ucm.get_device_profile(name=W["name"])
                            # print(getNPhone["lines"]["line"])
                                try:
                                    for e in range(len(DPLines)):
                                        print(DPLines)
                                        DPLines[e]["index"]=e+1
                                        NDevice=ucm.update_device_profile(name=f'{device["name"]}',lines={"line":DPLines})
                                        print(NDevice)
                                except:
                                    print("error 104 while updating line indexes")
                            
                    except:
                        print("error while handling device de-associating")
            except:
                print("this primary does not have any devices associated to it")
            ####deleting primary
            if Dn["state"]== True:
                TLine=ucm.delete_directory_number(uuid=f'{Dn["uuid"]}')
                
                if len(AssoDevices)>0:
                    for Device in AssoDevices:
                        ###This is if the device is phone (uncertainty about associated devices )
                        try:
                            GetDevice=ucm.get_phone(name=Device)
                            DPLines=[]
                            if GetDevice["return"]["deviceProfile"]["lines"]==None:
                                DPLines=[]
                            else:
                                DPLines=GetDevice["return"]["deviceProfile"]["lines"]["line"]
                            for e in range(len(DPLines)):
                                NDevice=ucm.update_phone(name=f'{Device}',removeLines={"line":DPLines[e]})
                                DPLines[e]["index"]=e+1
                                NDevice=ucm.update_phone(name=f'{Device}',addLines={"line":DPLines[e]})
                        ####This's if the device is Device  profile
                        except:
                            print("this extension doen not related to phone")
                        try:
                            GetDevice=ucm.get_device_profile(name=Device)
                            DPLines=[]
                            if GetDevice["return"]["deviceProfile"]["lines"]==None:
                                DPLines=[]
                            else:
                                DPLines=GetDevice["return"]["deviceProfile"]["lines"]["line"]
                            try:
                                for e in range(len(DPLines)):
                                    print(DPLines)
                                    DPLines[e]["index"]=e+1
                                    NDevice=ucm.update_device_profile(name=f'{Device}',lines={"line":DPLines})
                                    print(NDevice)
                            except:
                                print("error 107 -device profile- while updating line indexes")
                        except:
                            print("This extension does not related to device profile")
                        else:
                            return jsonify({"fault":f'Devices -{Device}- Associated to this exteniosn {Dn["uuid"]} does not exist anymore'})


        return jsonify({"data":[{'device': 'TCTUSER018', 'extensions': ['1018']}, {'device': 'user18', 'extensions': ['1018', '1012']}]})
    

@app.route('/TransferAssets',methods=['GET',"POST"])
def TransferAssets():
    data=request.json
    print(data)

    UserFind=ucm.get_user(userid=f'{data["From"]}')
    # print(UserFind)
    UserFindTo=ucm.get_user(userid=f'{data["To"]}')
    if(str(UserFindTo)=="Item not valid: The specified User was not found"):
        UserAdd=ucm.add_user(userid=f'{data["To"]}',lastName=str(data["LastName"]),firstName=str(data["FirstName"]),mailid=f'{data["Mail"]}')
        # print (UserAdd)
    UserFindTo=ucm.get_user(userid=f'{data["To"]}')
    pp=[]
    if(UserFind["associatedDevices"]==None):
        phoneNames=[]
    else:
        phoneNames=UserFind["associatedDevices"]["device"]
    if(UserFind["phoneProfiles"]==None):
        profileNames=[]
    else:
        profileNames=UserFind["phoneProfiles"]["profileName"]
    ##We need a loop for profiles as they are not in array
    for p in profileNames:
        profileAdd=pp.append(p["_value_1"])
    # print(phoneNames)
    
    pde=[]
    Intial=[]
    if (len(phoneNames)>0):
        for AD in phoneNames:
            GetDeviceInfo1=ucm.get_phone(name=f'{AD}')
            DevicesInfo=GetDeviceInfo1["lines"]["line"]
            for i in DevicesInfo:
                D=i["dirn"]["pattern"]
                pde.append(f'{D}')
            data1=Intial.append({"device":f'{AD}',"extensions":pde})
            pde=[]
    ppe=[]
    if(len(pp)>0):
        for AD in pp:
            Deviceprofile=ucm.get_device_profile(name=f'{AD}')
            DevicesInfo=Deviceprofile["return"]["deviceProfile"]["lines"]["line"]
            for i in DevicesInfo:
                D=i["dirn"]["pattern"]
                print(D)
                ppe.append(f'{D}')
            Intial.append({"device":f'{AD}',"extensions":ppe})
            print(ppe)
            print("Every device after DP update",Intial)
            #Transfer Profiles
    if (len(pp)>0)and (data["TransferCustom"]=="true"):
        for profiles in pp:
            if data[f'{str(profiles).upper()}']==True:
                try:
                    print(ucm.update_device_profile(name=f'{profiles}',newName=f'{UserFindTo["userid"]}', description=f'{UserFindTo["userid"]+" UDP"}'))
                except Fault as e:
                    print(e) 
                # print(UpdateDeviceProfile)
                NewDeviceProfile=ucm.get_device_profile(name=f'{UserFindTo["userid"]}')
                print("New device profile after update",NewDeviceProfile["return"])
                newProfileList=pp.remove(profiles)
                UserFind=ucm.get_user(userid=f'{data["From"]}')
                UserFindTo=ucm.get_user(userid=f'{data["To"]}')
                print("old user befor update -DP-",UserFind)
                UpdateOldUser=ucm.update_user(userid=f'{UserFind["userid"]}',phoneProfiles="",
                defaultProfile="",ctiControlledDeviceProfiles="",primaryExtension=UserFind["lineAppearanceAssociationForPresences"]["lineAppearanceAssociationForPresence"][0]["laapDirectory"])
                print("Update old user action status -DP-",UpdateOldUser)
                UpdateNewUser=ucm.update_user(userid=f'{UserFindTo["userid"]}',phoneProfiles={"profileName":{"_value_1":f'{UserFindTo["userid"]}'}},defaultProfile={"_value_1":f'{UserFindTo["userid"]}'},ctiControlledDeviceProfiles={"profileName": {"_value_1": f'{UserFindTo["userid"]}'}})
                UpdateNewUser1=ucm.update_user(userid=f'{UserFindTo["userid"]}', primaryExtension=UserFind["lineAppearanceAssociationForPresences"]["lineAppearanceAssociationForPresence"][0]["laapDirectory"],associatedGroups={"userGroup": [{"name": "Standard CCM End Users"},{"name":"Standard CTI Enabled"}]})
                print("update new user with the new info -DP-",UpdateNewUser1)

                #Transfer Devices
    if (len(phoneNames)>0)and (data["TransferCustom"]=="true"):
        if(UserFindTo["associatedDevices"]==None):
            NewPhoneListNew=[]
        else:
            NewPhoneListNew=UserFindTo["associatedDevices"]["device"]
        NewPhoneListOld=phoneNames.copy()
        ####there should be else for error
        for Phone in phoneNames:
            if data[f'{Phone}']==True:
                #Updating User
                NewPhoneListOld.remove(Phone)
                NewPhoneListNew.append(Phone)
                # print(NewPhoneListOld)
                # print(NewPhoneListNew)
                UpdateOldUser=ucm.update_user(userid=f'{UserFind["userid"]}',associatedDevices={"device":NewPhoneListOld})
                OldUser=UserFind=ucm.get_user(userid=f'{data["From"]}')
                print("old user info -D-",OldUser)

                UpdateNewUser=ucm.update_user(userid=f'{UserFindTo["userid"]}', associatedDevices={"device":NewPhoneListNew}, associatedGroups={"userGroup": [{"name": "Standard CCM End Users"},{"name":"Standard CTI Enabled"}]})
                try:
                    UpdateNewUser1=ucm.update_user(userid=f'{UserFindTo["userid"]}', primaryExtension=UserFind["lineAppearanceAssociationForPresences"]["lineAppearanceAssociationForPresence"][0]["laapDirectory"],selfService=UserFind["lineAppearanceAssociationForPresences"]["lineAppearanceAssociationForPresence"][0]["laapDirectory"])
                except TypeError:
                    UpdateNewUser1=ucm.update_user(userid=f'{UserFindTo["userid"]}',primaryExtension="",selfService="")
                ##Updateing phone
                print("update old user -D-",UpdateOldUser)
                PhoneStr=str(Phone)
                PhoneNewCap=str(UserFindTo["userid"]).upper()
                PhoneOldCap=str(UserFind["userid"]).upper()
                PhoneNew=PhoneStr.replace(PhoneOldCap,PhoneNewCap)
                # print(PhoneNew)
                UpdatePhoneDevice=ucm.update_phone(name=f'{Phone}',newName=f'{PhoneNew}', description=f'{"siteID " +UserFindTo["lastName"]}{" "}{UserFindTo["firstName"]}')
                # print(UpdatePhoneDevice)
                getPhone=ucm.get_phone(name=f'{PhoneNew}')
                # print(getPhone)
                getPhoneInfo=getPhone["lines"]["line"]
                line=[]
                for i in range(len(getPhoneInfo)):
                    #update line outside device
                    UpdateDn=ucm.update_directory_number(pattern=f'{getPhoneInfo[i]["dirn"]["pattern"]}',description=f'{"siteID " +UserFindTo["lastName"]}{" "}{UserFindTo["firstName"]}',alertingName=f'{UserFindTo["lastName"]}{" "}{UserFindTo["firstName"]}',asciiAlertingName=f'{UserFindTo["lastName"]}{" "}{UserFindTo["firstName"]}')
                    #updateline within device
                    getPhoneInfo[i]["display"]=f'{UserFindTo["lastName"]}{" "}{UserFindTo["firstName"]}'
                    getPhoneInfo[i]["displayAscii"]=f'{UserFindTo["lastName"]}{" "}{UserFindTo["firstName"]}'
                    getPhoneInfo[i]["e164Mask"]=f'+{getPhoneInfo[i]["dirn"]["pattern"]}'
                    getPhoneInfo[i]["label"]=f'{getPhoneInfo[i]["dirn"]["pattern"]}'
                    if (getPhone["name"][:3]=="CSF"):
                        getPhoneInfo[i]["associatedEndusers"]={"enduser":[{"userId":f'{UserFindTo["userid"]}'}]}
                    line.append(getPhoneInfo[i])
                    UpdatePhoneEx=ucm.update_phone(name=f'{PhoneNew}',lines={"line":line})
                    # print(UpdatePhoneEx)
                    getPhone=ucm.get_phone(name=f'{PhoneNew}')
                    # print(getPhone)

                
    return jsonify({"data":{"status":"success","Action":f'Assets has been trarnsfered saccusfully from user -{data["From"]}- to user -{data["To"]}-'}})

@app.route('/TransferUserAssets',methods=['GET',"POST"])
def TranferUserAssets():
    data=request.json
    # print(data)
    ####validation
    errors=[]
    if (data["TransferCustom"]==True or "true" or "True"):
        for key,value in data["XferUsers"].items():
            for k,v in value.items():
                UDevices={"CSF":0,"TAB":0,"BOT":0}
                if k=="phoneDevices":
                    for phone in v:
                        if "CSF" in phone["device"]:
                            UDevices["CSF"]+=1
                        if "TAB" in phone["device"]:
                            UDevices["TAB"]+=1
                        if "BOT" in phone["device"]:
                            UDevices["BOT"]+=1
                    if UDevices["CSF"]>1 or UDevices["TAB"]>1 or UDevices["BOT"]>1:
                        errors.append("user cannot have more than one unique device")
                elif k=="VM" and len(value[k])>1:
                    errors.append("User can't have more than 1 VoiceMail. However 1 VM can hold more than one extension")
                elif k=="deviceProfiles" and len(value[k])>1:
                    errors.append("User can't have more than 1 Device Profile. However 1 Device Profile can hold more than one extension")
    else:
        errors.append('Sorry, but you need to customize your transfer for now')
    if len(errors)>0:
            return jsonify({"error":errors})
    # print(data)
    ####implementation
    if (data["TransferCustom"]==True or "true" or "True"):
        ####Loop users
        for key,value in data["XferUsers"].items():
            oldUser={}
            newUser={}
            
            if key=="user1":
                oldUser=ucm.get_user(userid=f'{data["From"]}')
                # print(oldUser["associatedDevices"]["device"])
            elif key=="user2":
                newUser=ucm.get_user(userid=data["To"])
            PhoneNames=[]
            PhoneProfiles=[]
            for k,v in value.items():
                if k=="phoneDevices":
                    for phone in v:
                        PhoneNames.append(phone["device"])
                        getP=ucm.get_phone(name=phone["device"])
                        try:
                            DeleteLines=ucm.update_phone(name=phone["device"],removeLines={"line":getP["lines"]["line"]})
                            print("DeleteLines",DeleteLines)
                        except:
                            print("device ",phone["device"]," doesn't have lines")
                        
                        ### lines from the device from CUCM
                        tLines=[]
                        try:
                            
                            for li in getP["lines"]["line"]:
                                tLines.append(li)
                        except:
                            print("phone doesn't have lines to append to tLines  ",phone["device"])
                        ### lines from the device from UC Admin
                        ALine=[]
                        for i in range(len(phone["extensions"])):
                            # print("UC Admin    ",)
                            # newOrder.append(phone["extensions"][i])
                            
                            try:
                                # print("start looping")
                                # if len(tLines)>0:
                                    
                                    for line in tLines:
                                        # print("init looping")
                                        # print(line)
                                        #####it only needs to be indexed correctly -if True
                                        if line["dirn"]["pattern"] in phone["extensions"][i]["name"]:
                                            # print("end")
                                            line["index"]=i+1
                                            ALine.append(line)
                                            # updatePD=ucm.update_phone(name=phone["device"],removeLines={"line":line})
                                    LineExist=True
                                    for li in ALine:

                                        if phone["extensions"][i]["name"] in li["dirn"]["pattern"]:
                                            LineExist=False
                                            # print("begining if")
                                            # updatePD=ucm.update_phone(name=phone["device"],removeLines={"line":line})
                                    if LineExist:
                                        nLine={
                                            "index": i+1,
                                            "dirn": {"pattern": phone["extensions"][i]["name"], "routePartitionName":None},
                                            "display": "none",
                                            "displayAscii": "none",
                                            "label": "none",
                                            "e164Mask": "1234XXXX",
                                            }
                                        if key=="user1":
                                            nLine["display"]=nLine["displayAscii"]=f'{oldUser["lastName"]} {oldUser["firstName"]}'
                                            nLine["label"]=f'{oldUser["lastName"]} {oldUser["firstName"]} - {phone["extensions"][i]["name"]}'
                                        else:
                                            nLine["display"]=nLine["displayAscii"]=f'{newUser["lastName"]} {newUser["firstName"]}'
                                            nLine["label"]=f'{newUser["lastName"]} {newUser["firstName"]} - {phone["extensions"][i]["name"]}'
                                        ALine.append(nLine)
                    #             else:
                    #                 # print("begining try")
                    #                 line={
                    #     "index": i+1,
                    #     "dirn": {"pattern": phone["extensions"][i]["name"], "routePartitionName":None},
                    #     "display": "none",
                    #     "displayAscii": "none",
                    #     "label": "none",
                    #     "e164Mask": "1234XXXX",
                    # }
                    #                 if key=="user1":
                    #                     line["display"]=line["displayAscii"]=f'{oldUser["lastName"]} {oldUser["firstName"]}'
                    #                     line["label"]=f'{oldUser["lastName"]} {oldUser["firstName"]} - {phone["extensions"][i]["name"]}'
                    #                 else:
                    #                     line["display"]=line["displayAscii"]=f'{newUser["lastName"]} {newUser["firstName"]}'
                    #                     line["label"]=f'{newUser["lastName"]} {newUser["firstName"]} - {phone["extensions"][i]["name"]}'
                    #                 ALine.append(line)
                                    # updatePD=ucm.update_phone(name=phone["device"],addLines={"line":line})
                                    # print("add new line to phone that has no lines",phone["device"],line["dirn"]["pattern"],updatePD)
                            except:
                                print("failed to update lines")
                        print(ALine)
                        for lin in ALine:
                            print("lines that will be added ",lin["dirn"]["pattern"])
                            updatePD=ucm.update_phone(name=phone["device"],addLines={"line":lin})
                            # print("updatePD",updatePD)
                            # print("add new line to phone that has no lines",phone["device"],line["dirn"]["pattern"],updatePD)
                
                if k=="VM":
                    ##Looping list of VMs for the one user
                    for Vm in v:
                        DeleteUser=cuc.Delete_User(UserId=Vm["device"])
                        print(DeleteUser)
                        # print("VM:",v[ind])
                        getUserExs=cuc.Get_UserExtensions(UserUuid=Vm["uuid"])
                        print("User extensions",getUserExs["@total"])
                        if not(int(getUserExs["@total"]) >1):

                            print("this User VM will be deleted", Vm["device"])
                            
                        else:
                            print("this user will not be removed from CUC totally")
                    ##generator to find whom has extensions to be deployed
                    gen=(User for User in v if len(User["extensions"])!=0)
                    ExI=0
                    for User in gen:
                        print("User",User["device"])
                        print("this user will be created with first extension")
                        addPExt=cuc.Add_User(User["device"],User["extensions"][0]["name"],"")
                        print("addPExt",addPExt)
                        if addPExt.status_code==400 and key=="user1":
                            DeleteUser=cuc.Delete_User(UserId=data["To"])
                            addPExt=cuc.Add_User(User["device"],User["extensions"][0]["name"],"")
                            print("addPExt",addPExt)
                        elif addPExt.status_code==400 and key=="user2":
                            DeleteUser=cuc.Delete_User(UserId=data["To"])
                            addPExt=cuc.Add_User(User["device"],User["extensions"][0]["name"],"")
                            print("addPExt",addPExt)
                        if ExI>1:
                            
                            while ExI < len(User["extensions"]):
                                addExtToUser=cuc.Add_AlternateExtensions(UserId=User["device"],Extension=int(User["extensions"][ExI]["name"]),TemplateId=User["extensions"][ExI]["PartitionUuid"],index=ExI+1)
                                print("addExtToUser",addExtToUser)
                                print(f"this extension will be alternate extension",User["extensions"][ExI]["name"],"  ",User["device"])
                                ExI+=1
                            break
                        print("this user will be created again and have alternate extensions")
                       
                if k=="deviceProfiles":
                    for profile in v:
                        PhoneProfiles.append(profile["device"])
                        getP=ucm.get_device_profile(name=profile["device"])["return"]["deviceProfile"]
                        updatePP1=ucm.update_device_profile(name=profile["device"],lines={"line":[]})
                        print("updatePP1",updatePP1)
                        # print(getP)
                        ### lines from the device from CUCM
                        try:
                            tLines=[]
                            for li in getP["lines"]["line"]:
                                tLines.append(li)
                        except:
                            print("profile doesn't have lines to append to tLines  ",profile["device"])
                        ### lines from the device from UC Admin
                        ALine=[]
                        for i in range(len(profile["extensions"])):
                            print("UC Admin    ",)
                            # newOrder.append(profile["extensions"][i])
                            try:
                                print("start looping")
                                if len(tLines)>0:
                                    
                                    for line in tLines:
                                        print("init looping")
                                        # print(line)
                                        #####it only needs to be indexed correctly -if True
                                        if line["dirn"]["pattern"] in profile["extensions"][i]["name"]:
                                            # print("end")
                                            line["index"]=i+1
                                            ALine.append(line)
                                            # updatePD=ucm.update_profile(name=profile["device"],removeLines={"line":line})
                                        else:
                                            print("begining if")
                                            # updatePD=ucm.update_profile(name=profile["device"],removeLines={"line":line})

                                            nLine={
                                                "index": i+1,
                                                "dirn": {"pattern": profile["extensions"][i]["name"], "routePartitionName":None},
                                                "display": "none",
                                                "displayAscii": "none",
                                                "label": "none",
                                                "e164Mask": "1234XXXX",
                                                }
                                            if key=="user1":
                                                nLine["display"]=nLine["displayAscii"]=f'{oldUser["lastName"]} {oldUser["firstName"]}'
                                                nLine["label"]=f'{oldUser["lastName"]} {oldUser["firstName"]} - {profile["extensions"][i]["name"]}'
                                            else:
                                                nLine["display"]=nLine["displayAscii"]=f'{newUser["lastName"]} {newUser["firstName"]}'
                                                nLine["label"]=f'{newUser["lastName"]} {newUser["firstName"]} - {profile["extensions"][i]["name"]}'
                                            ALine.append(nLine)
                                else:
                                    print("begining try")
                                    line={
                                            "index": i+1,
                                            "dirn": {"pattern": profile["extensions"][i]["name"], "routePartitionName":None},
                                            "display": "none",
                                            "displayAscii": "none",
                                            "label": "none",
                                            "e164Mask": "1234XXXX",
                                        }
                                    if key=="user1":
                                        line["display"]=line["displayAscii"]=f'{oldUser["lastName"]} {oldUser["firstName"]}'
                                        line["label"]=f'{oldUser["lastName"]} {oldUser["firstName"]} - {profile["extensions"][i]["name"]}'
                                    else:
                                        line["display"]=line["displayAscii"]=f'{newUser["lastName"]} {newUser["firstName"]}'
                                        line["label"]=f'{newUser["lastName"]} {newUser["firstName"]} - {profile["extensions"][i]["name"]}'
                                    ALine.append(line)
                                    # updatePD=ucm.update_profile(name=profile["device"],addLines={"line":line})
                                    # print("add new line to profile that has no lines",profile["device"],line["dirn"]["pattern"],updatePD)
                            except:
                                print("failed to update DP lines")
                        # for lin in ALine:
                        print("ALine",ALine)
                        
                        updatePP=ucm.update_device_profile(name=profile["device"],lines={"line":ALine})
                        print("update total device profile lines",updatePP)
                        
            if key=="user1":
                oldUser=ucm.get_user(userid=f'{data["From"]}')
                # print("Old user old",oldUser["associatedDevices"])
                oldUser=ucm.update_user(userid=f'{data["From"]}',associatedDevices={"device":PhoneNames})

                # print("Old user new",oldUser,"phones",PhoneNames)
            elif key=="user2":
                newUser=ucm.get_user(userid=data["To"])
                # print("new user old",newUser["associatedDevices"])
                newUser=ucm.update_user(userid=f'{data["To"]}',associatedDevices={"device":PhoneNames})
                # print("new user new",newUser,"phones",PhoneNames)
            PhoneNames=[]
            PhoneProfiles=[]
    
    return jsonify({"status":"success","data":"transfer assets from user {0} to user {1} has been done successfully".format(data["From"],data["To"])})

@app.route("/Tickets",methods=["GET","POST","OPTIONS"])
def Tickets():
    print("request")
    Mongo_return=list(db.table("Actions").find({"type":"action"}))
    print(Mongo_return)
    res=jsonify({"data":'data has been sent'})
    # res1=res.headers.add('Access-Control-Allow-Origin', '*')
    # res.headers.add('access-control-allow-headers', '*')
    # res.headers.add('access-control-allow-methods', '*')
    return jsonify({'data':Mongo_return})
@app.route("/Tickets/<TicketId>",methods=["GET","POST","OPTIONS"])
def Ticket(TicketId):
    # print(TicketId)
    # Mongo_return=list(db.table("Actions").find({"type":"action"}))
    Before_User=db.table("Before_User").find_one({"_id":TicketId})
    After_User=db.table("After_User").find_one({"_id":TicketId})
    After_VM=db.table("After_VM").find_one({"_id":TicketId})
    Before_VM=db.table("Before_VM").find_one({"_id":TicketId})
    After_DN=db.table("After_DN").find_one({"_id":TicketId})
    Before_DN=db.table("Before_DN").find_one({"_id":TicketId})
    Before_Device=db.table("Before_Device").find_one({"_id":TicketId})
    After_Device=db.table("After_Device").find_one({"_id":TicketId})
    # Mongo_return=db.table("Before_VM").find({"_id":TicketId}))
    
    print(Before_User)
    # return jsonify({"data":'data has been sent'})
    # res1=res.headers.add('Access-Control-Allow-Origin', '*')
    # res.headers.add('access-control-allow-headers', '*')
    # res.headers.add('access-control-allow-methods', '*')
    return jsonify({'ok':{'User':{"Before_User":Before_User,'After_User':After_User},'Device':{'After_Device':After_Device,'Before_Device':Before_Device},'DN':{'Before_DN':Before_DN,'After_DN':After_DN},'VM':{'Before_VM':Before_VM,'After_VM':After_VM}}})

if __name__=='__main__':
    app.run(debug=True)










