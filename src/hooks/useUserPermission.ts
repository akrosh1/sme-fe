'use client'
import useUserStore from "@/store/user-store"

type PermissionValue = 0 | 1;

interface ModulePermissions {
    [subModule: string]: PermissionValue;
}

interface Permissions {
    [module: string]: ModulePermissions;
}
export const usePermissions = ()=>{
    const {userPackage: packagesData ,user ,sipPermissionData} = useUserStore((state)=>state);


    const permissions:Permissions | any = packagesData?.permissions;
    const findModuleByModuleSubName = (moduleSubName:string)=>{
        for(const module in permissions){
            if(Object.prototype.hasOwnProperty.call(permissions[module], moduleSubName)){
                return module
            }
        }
        return null
    }

    const findModuleByModuleSubNameSipUser = (moduleName:string)=>{
        const permissions:Permissions | any = sipPermissionData?.role?.[0]?.permissions


        if (!permissions) {
            return '';
        }
        for(const module of Object.keys(permissions)){
            if(Object.prototype.hasOwnProperty.call(permissions[module], moduleName)){
                return module
            }
        }
    }

    const hasModulePermission = (moduleName: string) => {
        const moduleNameParentModule = findModuleByModuleSubName(moduleName);
        const hasModuleAccess = moduleNameParentModule ? Boolean(permissions[moduleNameParentModule][moduleName]) : false

        return hasModuleAccess
    };

    const hasSipUserPermission = (moduleName: string) => {
        // const {userPackage: packagesData ,user, sipPermissionData} = useUserStore((state)=>state);
        if(user?.isCustomer){
            return true
        }else{
            const moduleNameParentModule = findModuleByModuleSubNameSipUser(moduleName);
            if(moduleNameParentModule){
                const hasModuleAccess = sipPermissionData?.role?.find((item) => {
                    // @ts-expect-error:will fix later 
                    const parentPermissions = item.permissions?.[moduleNameParentModule]
                    return parentPermissions?.[moduleName]?.status === 1;
                });
            
                return !!hasModuleAccess; // Return a boolean indicating permission
            }else{
                return false
            }
        }
    };

    return {hasModulePermission , hasSipUserPermission }
}