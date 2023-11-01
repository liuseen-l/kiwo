import { DepType, RawDep } from "../types"

export function parseDependency(name: string, version: string, type: DepType,): RawDep {
  return {
    name,
    currentVersion: version,
    source: type,
  }
}

export function parseDependencies(pkg: any, type: DepType,): RawDep[] {
  return Object.entries(pkg[type] || {}).map(([name, version]) => parseDependency(name, version as string, type))
}
