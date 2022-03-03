import { expect } from 'chai'
import { e2eProjectDirs } from '@packages/frontend-shared/cypress/e2e/support/e2eProjectDirs'
import { detect } from '../../src'
import Fixtures from '@tooling/system-tests/lib/fixtures'
import path from 'path'
import fs from 'fs-extra'

export async function scaffoldMigrationProject (project: typeof e2eProjectDirs[number]) {
  Fixtures.removeProject(project)

  await Fixtures.scaffoldProject(project)

  return fs.readJSONSync(path.join(Fixtures.projectPath(project), 'package.json'))
}

describe('detect', () => {
  it('Create React App v4', async () => {
    const pkg = await scaffoldMigrationProject('create-react-app-unconfigured')
    const actual = detect({ ...pkg, dependencies: { ...pkg.dependencies, 'react-scripts': '4.0.0' } })

    expect(actual.framework.type).to.eq('crav4')
  })

  it('Create React App v5', async () => {
    const pkg = await scaffoldMigrationProject('create-react-app-unconfigured')
    const actual = detect(pkg)

    expect(actual.framework.type).to.eq('crav5')
  })

  it('React App with webpack 5', async () => {
    const pkg = await scaffoldMigrationProject('react-app-webpack-5-unconfigured')
    const actual = detect(pkg)

    expect(actual.framework.type).to.eq('react')
    expect(actual.bundler).to.eq('webpack5')
  })

  it(`Vue CLI w/ Vue 2`, async () => {
    const pkg = await scaffoldMigrationProject('vueclivue2-unconfigured')
    const actual = detect(pkg)

    expect(actual.framework.type).to.eq('vueclivue2')
  })

  it(`Vue CLI w/ Vue 3`, async () => {
    const pkg = await scaffoldMigrationProject('vueclivue3-unconfigured')
    const actual = detect(pkg)

    expect(actual.framework.type).to.eq('vueclivue3')
  })

  it(`React with Vite`, async () => {
    const pkg = await scaffoldMigrationProject('react-vite-ts-unconfigured')
    const actual = detect(pkg)

    expect(actual.framework.type).to.eq('react')
    expect(actual.bundler).to.eq('vite')
  })

  it(`Vue with Vite`, async () => {
    const pkg = await scaffoldMigrationProject('vue3-vite-ts-unconfigured')
    const actual = detect(pkg)

    expect(actual.framework.type).to.eq('vue3')
    expect(actual.bundler).to.eq('vite')
  })

  it(`Next.js`, async () => {
    const pkg = await scaffoldMigrationProject('nextjs-unconfigured')
    const actual = detect(pkg)

    expect(actual.framework.type).to.eq('nextjs')
    expect(actual.bundler).to.eq(undefined)
  })

  ;['10', '11', '12'].forEach((v) => {
    it(`Next.js v${v}`, async () => {
      const pkg = await scaffoldMigrationProject('nextjs-unconfigured')
      const actual = detect({ ...pkg, dependencies: {
        'next': v,
      } })

      expect(actual.framework.type).to.eq('nextjs')
      expect(actual.bundler).to.eq(undefined)
    })
  })

  it(`no framework or library`, async () => {
    const actual = detect({})

    expect(actual.framework).to.be.undefined
    expect(actual.bundler).to.be.undefined
  })
})