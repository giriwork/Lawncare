var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler();
app.UseHttpsRedirection();

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    application = "Lawncare",
    phase = "0"
})).WithName("HealthCheck");

app.MapPost("/api/auth/login", (LoginRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.PhoneNumber))
    {
        return Results.BadRequest(new ApiError(
            "Enter a valid phone number.",
            "INVALID_PHONE_NUMBER"));
    }

    // A phone number alone is not proof of identity. Connect a real OTP/SMS
    // provider and issue a short-lived authenticated session/token before
    // enabling sign-in.
    return Results.Problem(
        title: "Phone verification is not configured",
        detail: "Sign-in is not available yet. A secure phone verification provider must be configured first.",
        statusCode: StatusCodes.Status501NotImplemented,
        extensions: new Dictionary<string, object?>
        {
            ["code"] = "PHONE_VERIFICATION_NOT_CONFIGURED"
        });
}).WithName("StartLogin");

app.Run();

internal sealed record LoginRequest(string PhoneNumber);
internal sealed record ApiError(string Message, string Code);
