const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'YouTube To MP3-win32-x64/'),
    authors: 'Guillaume Smaha',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'YouTube To MP3.exe',
    setupExe: 'YouTube-To-MP3-Installer.exe',
    setupIcon: path.join(rootPath, 'logo.ico')
  })
}