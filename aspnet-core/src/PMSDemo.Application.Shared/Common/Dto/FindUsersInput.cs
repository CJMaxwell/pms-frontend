﻿using PMSDemo.Dto;

namespace PMSDemo.Common.Dto
{
    public class FindUsersInput : PagedAndFilteredInputDto
    {
        public int? TenantId { get; set; }
    }
}