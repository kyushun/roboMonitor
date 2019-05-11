Dim fso
Set fso = createObject("Scripting.FileSystemObject")

Dim objShell
Set objShell = Wscript.CreateObject("WScript.shell")
objShell.CurrentDirectory = fso.getParentFolderName(WScript.ScriptFullName)

Dim env
Set env = objShell.Environment("Process")
env.Item("PORT") = 80

objShell.Run "npm start", 0