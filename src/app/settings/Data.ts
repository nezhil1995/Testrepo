export interface Data{
  amid:number
  ammetername:string
  ammetersource:string
  ammetercode:string
  ammetergroup:string
  ammetercategory:string
  ammeterlocation:string
  amplantname:string
  amconsiderbool: boolean
  ammeterthreshold:number
}

export interface User{
  udid:number
  udusercode:string
  udusername:string
  udtype:string
  udfirstName:string
  udlastName:string
  udemail:string
  udpassword:string
  udconfirmpassword:string
  udplantname:string
  udlanguage:string
  udscrectkey:string
}

export interface PlantNam{
  ttid:number
  ttcode:string
  ttplntname:string
  ttdaystarttime:string
  tts1time:string
  tts2time:string
  tts3time:string
  ttlastupdate:string
  ttcreatedby:string
  ttmodifiedby:string
}

export interface Session{
  pkid:number
  pkcode:string
  pkplantname:string
  pkstatus:any
  pkstart:string
  pkend:string
}

export interface GroupMan{
  agid:number
  agplantname:string
  aggroupname:string
  aggroupcode:string
}

export interface Source{
  asid:number
  assourcename:string
  asplantname:string
  assourcecode:string
  assourcecapacity:number
}

export interface Sectab{
  sec_id:number
  sec_date: string
  sec_energy:string
  sec_material:string
  sec_value:string
  sec_conform:boolean,
  sec_group:string
}

export interface Cost{
  EB_id:number
  EB_date:string
  EB_Session:string
  EB_SessionCost:string
}

export interface DgCost{
  dg_id:number
  dg_date:string
  dg_desc:string
  dg_lit_cons:string
  dg_lit_cpl:string
  dg_cost_conform: boolean
}

export interface WindCost{
  Wind_id:number
  Wind_month:string
  Wind_percentage:string
  Wind_cost:string
}

export interface KVACost{
  kva_id:number
  kva_unitname:string
  kva_alldemand:number
  kva_Costforkva:number
  kva_penaltycost:number
  kva_minpercentage:number
}

export interface Solarcost{
  solar_id:number
  solar_installedCap:string
  solar_cst:number
}

export interface Windcost{
  Wind_id:number
  Wind_month:string
  Wind_percentage:number
  Wind_cost:number
}

export interface PetrolCost{
  pt_id:number
  pt_date:string
  pt_lit_cons:number
  pt_cpl:number
}

export interface LpgCost{
  LPG_id:number
  LPG_date:string
  LPG_kg_cons:number
  LPG_cpkg:number
}

export interface CngCost{
  CNG_id:number
  CNG_date:string
  CNG_kg_cons:number
  CNG_cpkg:number
}

export interface PngCost{
  PNG_id:number
  PNG_date:string
  PNG_kg_cons:number
  PNG_cpkg:number
}

export interface WaterCost{
  wt_id:number
  wt_date:string
  wt_type:string
  wt_source:string
  wt_consume:number
  wt_state:boolean
  wt_cost:number
  wt_cost_conform:boolean
}
