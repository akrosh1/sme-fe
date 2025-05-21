export interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type: string;
}

export interface PermissionGroup {
  [contentType: string]: Permission[];
}

export const groupPermissions = (
  permissions: Permission[],
): PermissionGroup => {
  return permissions.reduce((acc, permission) => {
    const contentType = permission.content_type.split(' | ')[0];
    if (!acc[contentType]) {
      acc[contentType] = [];
    }
    acc[contentType].push(permission);
    return acc;
  }, {} as PermissionGroup);
};
