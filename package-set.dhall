let upstream = https://github.com/dfinity/vessel-package-set/releases/download/mo-0.14.11-20250516/package-set.dhall sha256:54306374e258cb87d8c4522d15d0d59c435388d60377e9a19f39c7ffbd93f0bf
let Package =
    { name : Text, version : Text, repo : Text, dependencies : List Text }

let
  -- This is where you can add your own packages to the package-set
  additions =
    [] : List Package

let
  {- This is where you can override existing packages in the package-set

     For example, if you wanted to use version `v2.0.0` of the foo library:
     let overrides = [
         { name = "foo"
         , version = "v2.0.0"
         , repo = "https://github.com/bar/foo"
         , dependencies = [] : List Text
         }
     ]
  -}
  overrides =
    [] : List Package

in  upstream # additions # overrides
