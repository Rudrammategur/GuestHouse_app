const sql = require("mssql");

const { poolPromise } = require("../config/db");

/*
=========================================================
Get Module Settings
=========================================================
*/

exports.getModuleSettings = async (moduleName) => {

    const pool = await poolPromise;

    const result = await pool.request()

        .input(
            "ModuleName",
            sql.VarChar,
            moduleName
        )

        .query(`

SELECT

SettingID,

ModuleName,

Category,

SettingKey,

SettingValue,

DataType,

DisplayName,

Description,

DisplayOrder,

IsEditable

FROM SystemSettings

WHERE

ModuleName=@ModuleName

AND

IsActive=1

ORDER BY

Category,

DisplayOrder

`);

    return result.recordset;

};

/*
=========================================================
Update Settings
=========================================================
*/

exports.updateSettings = async (

    moduleName,

    settings,

    employeeId

) => {

    const pool = await poolPromise;

    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {

        for (const setting of settings) {

            await new sql.Request(transaction)

                .input(
                    "ModuleName",
                    sql.VarChar,
                    moduleName
                )

                .input(
                    "SettingKey",
                    sql.VarChar,
                    setting.SettingKey
                )

                .input(
                    "SettingValue",
                    sql.NVarChar,
                    setting.SettingValue
                )

                .input(
                    "UpdatedBy",
                    sql.VarChar,
                    employeeId
                )

                .query(`

UPDATE SystemSettings

SET

SettingValue=@SettingValue,

UpdatedBy=@UpdatedBy,

UpdatedDate=GETDATE()

WHERE

ModuleName=@ModuleName

AND

SettingKey=@SettingKey

`);

        }

        await transaction.commit();

        return true;

    }

    catch (err) {

        await transaction.rollback();

        throw err;

    }

};