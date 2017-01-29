

eris init 

setenv

eris chains make --account-types=Root:2,Full:1,Developer:1 chaintonic

set chain_dir=%HOME%\.eris\chains\chaintonic
set chain_dir_this=%chain_dir%\chaintonic_developer_000

eris chains start chaintonic --init-dir %chain_dir_this%




eris chains stop chaintonic
eris chains rm chaintonic --data --dir --force

