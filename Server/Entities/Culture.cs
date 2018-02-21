using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Euroland.NetCore.AnnualReport.WebApp.Entities
{
    public class Culture
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual List<Resource> Resources { get; set; }
    }
}
