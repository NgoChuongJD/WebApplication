using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    public class SampleRepository : ISampleRepository
    {
        public readonly IApplicationDbContext _dbcontext;
        public SampleRepository(IApplicationDbContext dbcontext)
        {
            _dbcontext = dbcontext ?? throw new ArgumentNullException(nameof(dbcontext));

        }
        public int GetData()
        {
            return this._dbcontext.ExecNonQuery("");
        }
    }
}
