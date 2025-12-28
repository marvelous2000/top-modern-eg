
CREATE POLICY "Users can read their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
